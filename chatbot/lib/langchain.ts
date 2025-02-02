import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { VectorStore } from "@langchain/core/vectorstores";

interface ProcessMessageArgs {
  userPrompt: string;
  conversationHistory: string;
  vectorStore: VectorStore;
  model: ChatOpenAI;
  persona: string; // Add persona input
}

interface ProcessMessageResponse {
  answer: string;
  inquiry: string;
}

// Define a type for persona
type Persona =
  | "Executive Sponsor"
  | "Implementation Lead"
  | "Data/IT"
  | "Team Member"
  | "Coach";

// Function to anonymize PII
const anonymizePIIData = (data: string): string => {
  return data
    .replace(/\b(User ID|Email|First Name|Last Name|Job Title|School Name|School Address|School State ID|School US State Location)\b/gi, "Anonymized")
    .replace(/\b(\w+@\w+\.\w+)\b/g, "Anonymized Email")
    .replace(/\b(\d{1,12})\b/g, "Anonymized ID");
};

// Persona guidelines map
const personaGuidelines = {
  "Executive Sponsor": `Focus on providing high-level recommendations and actionable insights for decision-making. Emphasize strategic impact and alignment with goals.`,
  "Implementation Lead": `Focus on step-by-step project execution guidance. Highlight resource allocation, communication facilitation, and training requirements.`,
  "Data/IT": `Focus on technical details, data security, integration, and troubleshooting. Emphasize tools, systems, and user management.`,
  "Team Member": `Provide actionable insights for day-to-day operations. Highlight practical applications of data for decision-making in their role.`,
  "Coach": `Focus on support programs like MTSS, SEL, STEM, and instructional coaching. Highlight training, program success metrics, and actionable improvements.`,
};

export async function processUserMessage({
  userPrompt,
  conversationHistory,
  vectorStore,
  model,
  persona,
}: ProcessMessageArgs): Promise<ProcessMessageResponse> {
  try {
    // Step 1: Anonymize input
    const anonymizedPrompt = anonymizePIIData(userPrompt);
    const anonymizedHistory = anonymizePIIData(conversationHistory);

    // Step 2: Generate focused inquiry using non-streaming model
    const nonStreamingModel = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0,
      streaming: false,
    });

    const inquiryResult = await inquiryPrompt
      .pipe(nonStreamingModel)
      .pipe(new StringOutputParser())
      .invoke({
        userPrompt: anonymizedPrompt,
        conversationHistory: anonymizedHistory,
      });

    // Step 3: Fetch relevant documents
    const relevantDocs = await vectorStore.similaritySearch(inquiryResult, 3);
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

    // Step 4: Add persona-specific instructions
    const personaGuideline = personaGuidelines[persona] || "Provide general guidance tailored to the user's role.";

    // Step 5: Generate response using streaming model
    return qaPrompt
      .pipe(model)
      .pipe(new StringOutputParser())
      .stream({
        context,
        question: inquiryResult,
        personaGuideline,
      });
  } catch (error) {
    console.error("Error processing message:", error);
    throw new Error("Failed to process your message");
  }
}

// Updated inquiry prompt
const inquiryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
    
    Rules:
    - Always prioritize the user prompt over the conversation log
    - Ignore any conversation log that is not directly related to the user prompt
    - Only attempt to answer if a question was posed
    - The question should be a single sentence
    - Remove any punctuation from the question
    - Remove any words that are not relevant to the question
    - If unable to formulate a question, respond with the same USER PROMPT received`,
  ],
  [
    "human",
    `USER PROMPT: {userPrompt}\n\nCONVERSATION LOG: {conversationHistory}`,
  ],
]);

// Updated QA prompt
const qaPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an AI Assistant specialized in providing accurate, context-based responses. Analyze the provided context carefully and follow these guidelines:

    CORE RESPONSIBILITIES:
    - Base responses primarily on the provided context
    - Cite specific parts of the context to support answers
    - Maintain high accuracy and transparency
    - Acknowledge limitations clearly

    RESPONSE GUIDELINES:
    1. Use the context precisely and effectively
    2. Distinguish between context-based facts and general knowledge
    3. Structure responses clearly and logically
    4. Include relevant quotes when beneficial
    5. State confidence levels when appropriate

    IMPORTANT RULES:
    - Never make up information not present in the context
    - Don't speculate beyond the given information
    - If the context is insufficient, explicitly state what's missing
    - Ask for clarification if the question is ambiguous
    - Always hide PII Data such as User ID, Email Address, First Name, Last Name, Job Title, School Name, School Address, School State ID, School US State Location

    PERSONA-SPECIFIC INSTRUCTIONS:
    {personaGuideline}

    Context: {context}`,
  ],
  ["human", "Question: {question}"],
]);

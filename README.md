# Full Stack RAG_bot 


# Features
📁 PDF file upload and processing
🔍 Advanced RAG (Retrieval Augmented Generation)
💬 Interactive chat interface
🔄 Real-time streaming responses
📚 Context-aware conversations
🎨 Modern UI with Tailwind CSS

# Building a RAG-Powered Chatbot using LangChain and Pinecone in Next.js

## Introduction
This project demonstrates how to build a chatbot capable of answering questions based on PDF content. It leverages **Next.js 13+**, **OpenAI**, **LangChain**, **Pinecone DB**, and the **Vercel AI SDK** to deliver accurate, domain-specific responses by combining Retrieval-Augmented Generation (RAG) with Large Language Models (LLMs).


## What are Large Language Models (LLMs)?
LLMs, such as OpenAI's ChatGPT or Anthropic's Claude, are AI algorithms designed to process, generate, and understand human language. They can perform tasks such as:
- Translation
- Summarization
- Question Answering
- Creative Writing

### Challenges with LLMs
- **Hallucination**: Responses may sound confident but can be incorrect.
- **Knowledge Staleness**: Limited to training data cutoff.
- **Context Management**: Limited token windows for managing conversations.
- **Domain-Specific Knowledge**: Struggles with accurate domain-specific responses without fine-tuning.

---

## What is Retrieval-Augmented Generation (RAG)?
RAG combines LLMs with real-time data retrieval systems, allowing the model to reference up-to-date and accurate knowledge.

### RAG Workflow
1. **Retrieval**: Fetch relevant data from external sources (e.g., Pinecone).
2. **Augmentation**: Combine retrieved data with the user's query.
3. **Generation**: Produce responses grounded in retrieved documents.

### Benefits of RAG
- **Accurate and Current Information**
- **Cost-Efficient Knowledge Updates**
- **Traceable and Verifiable Responses**

---

## Project Features
- **PDF Chunking**: Break PDFs into manageable pieces and store them in Pinecone.
- **Semantic Search**: Retrieve relevant information using embeddings.
- **Real-Time Interaction**: Streaming AI responses in a chat interface.
- **Deployment-Ready**: Optimized for production with Vercel.

---

## Technologies Used
- **Next.js 13+**: Frontend framework.
- **LangChain**: RAG pipelines and processing.
- **Pinecone**: Vector database for semantic search.
- **OpenAI**: Embedding and LLM support.
- **Tailwind CSS**: Styling.
- **TypeScript**: Strong type safety.
- **Vercel AI SDK**: Chat helper functions.

---

## Prerequisites
- **Node.js 18+**
- **OpenAI API key**
- **Pinecone API key and account**
- **Basic knowledge of Next.js and React**
- **A publicly accessible PDF URL**

---

## Setup and Installation

### Clone the Repository
```bash
git clone https://github.com/PatelPratik39/RAG_bot.git
cd chatbot


```
npm install 

``` .env file
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-west4-gcp-free
PINECONE_INDEX_NAME=your_index_name


```
npm run dev

-   Visit http://localhost:3000 to view your chatbot.
-   Visit http://localhost:3000/update to upload pdf document.

# Core Project Components
    1.  Document Processing
        * Chunk PDFs using LangChain and pdf-parse.
        * Convert text into embeddings for semantic search.
    2.  Pinecone Integration
        * Store and retrieve document embeddings using Pinecone.
    3.  Chat Interface
        * Real-time responses with streaming capabilities.
        * Styled with Tailwind CSS.
    4.  LangChain API
        * Processes user queries and fetches context from Pinecone.
        * Generates AI responses based on retrieved context.
        
# Future Steps
    * Enhance the chatbot by:
        -  Allow all types of Data processing like .xlsx, .xls, .csv, .docs
        -  Genrate different Graphs based on Execel Data using .xlsx and xls extention
        -  Adding authentication.
        -  Supporting multiple PDFs.
        -  Storing conversation history.
        -  Improving error boundaries and animations.

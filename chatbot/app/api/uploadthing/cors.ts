import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  pdfUpload: f({
    pdf: { maxFileSize: "1GB", maxFileCount: 1 },  //should be allowed 1 GB size of file
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "Prats" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
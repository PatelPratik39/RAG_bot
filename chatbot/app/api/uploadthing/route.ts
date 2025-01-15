import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./cors";

// Export routes for Next App Router  - GET and POST API requests
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
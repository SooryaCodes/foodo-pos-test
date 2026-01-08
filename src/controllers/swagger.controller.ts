import { IncomingMessage, ServerResponse } from "http";
import swaggerUi from "swagger-ui-dist";
import { swaggerSpec } from "../swagger";
import fs from "fs";
import path from "path";

const swaggerPath = swaggerUi.getAbsoluteFSPath();

export function swaggerController(
  req: IncomingMessage,
  res: ServerResponse
): void {

  // Redirect /docs → /docs/
  if (req.url === "/docs") {
    res.writeHead(302, { Location: "/docs/" });
    res.end();
    return;
  }

  // Serve swagger spec
  if (req.url === "/docs/swagger.json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(swaggerSpec));
    return;
  }

  // Serve swagger UI files
  const filePath = path.join(
    swaggerPath,
    req.url?.replace("/docs/", "") || "index.html"
  );

  if (fs.existsSync(filePath)) {
    const contentType =
      filePath.endsWith(".html") ? "text/html" :
      filePath.endsWith(".css") ? "text/css" :
      filePath.endsWith(".js") ? "application/javascript" :
      "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end();
}
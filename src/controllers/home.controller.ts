import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Serves the home page HTML
 */
export function homeController(
  req: IncomingMessage,
  res: ServerResponse
): void {
  try {
    const projectRoot = process.cwd();
    const htmlPath = join(projectRoot, "src", "public", "index.html");
    const html = readFileSync(htmlPath, "utf-8");

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (error) {
    console.error("Error serving home page:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}


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
  if (req.url === "/docs/swagger.json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(swaggerSpec));
    return;
  }

  const filePath = path.join(
    swaggerPath,
    req.url?.replace("/docs", "") || "index.html"
  );

  if (fs.existsSync(filePath)) {
    res.writeHead(200);
    res.end(fs.readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end();
}
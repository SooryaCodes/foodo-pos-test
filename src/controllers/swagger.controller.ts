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

  // Serve custom index.html with our swagger.json
  if (req.url === "/docs/" || req.url === "/docs/index.html") {
    const swaggerUiBundlePath = path.join(swaggerPath, "swagger-ui-bundle.js");
    const swaggerUiStandalonePath = path.join(swaggerPath, "swagger-ui-standalone-preset.js");
    const swaggerUiCssPath = path.join(swaggerPath, "swagger-ui.css");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Foodo POS API Documentation</title>
  <link rel="stylesheet" type="text/css" href="/docs/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/docs/swagger-ui-bundle.js"></script>
  <script src="/docs/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  // Serve swagger UI static files (CSS, JS)
  const filePath = path.join(
    swaggerPath,
    req.url?.replace("/docs/", "") || ""
  );

  if (fs.existsSync(filePath)) {
    const contentType =
      filePath.endsWith(".css") ? "text/css" :
      filePath.endsWith(".js") ? "application/javascript" :
      filePath.endsWith(".html") ? "text/html" :
      "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end();
}
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(projectRoot, process.argv[2] || "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

function validateSheetsEndpoint(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error("site-config.js must contain a valid Apps Script Web App URL."); }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname) || url.username || url.password || url.hash) {
    throw new Error("site-config.js must contain the public HTTPS /exec URL of the Apps Script Web App.");
  }
  return url.href;
}

async function readSiteConfig() {
  const config = await readFile(path.join(root, "site-config.js"), "utf8");
  const literal = config.match(/^\s*sheetsEndpoint\s*:\s*("(?:[^"\\]|\\.)*")\s*,?\s*$/m);
  if (!literal || (config.match(/sheetsEndpoint\s*:/g) || []).length !== 1) {
    throw new Error("site-config.js must define exactly one JSON-string sheetsEndpoint.");
  }
  return { source: config, endpoint: validateSheetsEndpoint(JSON.parse(literal[1])) };
}

const { endpoint: sheetsEndpoint } = await readSiteConfig();
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webp", "image/webp"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
]);

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const urlPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) && target !== path.join(root, "index.html")) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (relative === "site-config.js") {
      const { source } = await readSiteConfig();
      response.writeHead(200, {
        "Content-Type": "text/javascript; charset=utf-8",
        "Content-Length": Buffer.byteLength(source),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      }).end(source);
      return;
    }
    const info = await stat(target);
    if (!info.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mime.get(path.extname(target).toLowerCase()) || "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, host, () => console.log(`Serving ${root} at http://${host}:${port} (Sheets endpoint configured: ${Boolean(sheetsEndpoint)})`));

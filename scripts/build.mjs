import { cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");

function validateEndpoint(value) {
  if (!value || value === "__SHEETS_WEB_APP_URL__") {
    throw new Error("Set the public Apps Script /exec URL in public/site-config.js before building.");
  }
  let url;
  try { url = new URL(value); } catch { throw new Error("site-config.js must contain a valid public Apps Script URL."); }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname) || url.username || url.password || url.hash) {
    throw new Error("site-config.js must contain the public HTTPS /exec URL of the read-only Apps Script Web App.");
  }
  return url.href;
}

const configSource = await readFile(path.join(publicDir, "site-config.js"), "utf8");
const endpointLiteral = configSource.match(/^\s*sheetsEndpoint\s*:\s*("(?:[^"\\]|\\.)*")\s*,?\s*$/m);
if (!endpointLiteral) throw new Error("site-config.js must declare exactly one JSON-string sheetsEndpoint.");
const endpoint = validateEndpoint(JSON.parse(endpointLiteral[1]));
if ((configSource.match(/sheetsEndpoint\s*:/g) || []).length !== 1) throw new Error("Define sheetsEndpoint only once in public/site-config.js.");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });

const routes = JSON.parse(await readFile(path.join(distDir, "manus-routes.json"), "utf8"));
if (!Array.isArray(routes.routes) || !routes.routes.some((route) => route.path === "/")) {
  throw new Error("manus-routes.json must declare the home route.");
}
for (const file of [
  "index.html", "site-config.js", "manus-routes.json",
  "css/main.css", "css/components.css", "css/responsive.css",
  "js/app.js", "js/data/data-core.js", "js/components/addon-row.js", "js/components/payment-logo.js",
  "js/utils/dom.js", "js/utils/format.js",
  "assets/images/sim-hero.webp", "assets/images/we-project-mark.webp",
  "assets/icons/addon-phone.svg", "assets/icons/addon-data.svg", "assets/icons/addon-generic.svg",
]) {
  await readFile(path.join(distDir, file));
}
console.log(`Built independent static website to dist/ with modular CSS/JS assets (endpoint ${endpoint}).`);

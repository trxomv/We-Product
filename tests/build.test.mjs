import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const config = await readFile(new URL("../public/site-config.js", import.meta.url), "utf8");
const buildScript = await readFile(new URL("../scripts/build.mjs", import.meta.url), "utf8");
const appsScript = await readFile(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
const manifest = await readFile(new URL("../apps-script/appsscript.json", import.meta.url), "utf8");
const frontend = await readFile(new URL("../public/js/app.js", import.meta.url), "utf8");
const addonComponent = await readFile(new URL("../public/js/components/addon-row.js", import.meta.url), "utf8");
const indexHtml = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const stylesheets = await Promise.all(["main.css", "components.css", "responsive.css"].map((file) => readFile(new URL(`../public/css/${file}`, import.meta.url), "utf8")));
const routeManifest = JSON.parse(await readFile(new URL("../public/manus-routes.json", import.meta.url), "utf8"));

test("public endpoint has one clear configuration location and no hardcoded contact or legacy plan data", async () => {
  assert.match(config, /sheetsEndpoint\s*:/);
  assert.equal((config.match(/sheetsEndpoint\s*:/g) || []).length, 1);
  assert.doesNotMatch(config, /spreadsheetId|whatsappNumber|whatsappGroupUrl|telegramGroupUrl|chat\.whatsapp\.com|t\.me\//i);
  assert.doesNotMatch(frontend, /201554551710|CAGWbmHZLx0B1zIF5sQzRc|K6sC-Da1_VBjNTRk/);
  await assert.rejects(readFile(new URL("../public/offers.json", import.meta.url)), { code: "ENOENT" });
});

test("static build validates site-config.js and copies the complete public tree to dist", () => {
  assert.match(buildScript, /Set the public Apps Script \/exec URL in public\/site-config\.js/);
  assert.match(buildScript, /script\.google\.com/);
  assert.match(buildScript, /await cp\(publicDir, distDir, \{ recursive: true \}\)/);
  assert.match(buildScript, /manus-routes\.json/);
  assert.doesNotMatch(buildScript, /process\.env/);
  for (const asset of ["css/main.css", "css/components.css", "css/responsive.css", "js/app.js", "js/data/data-core.js", "js/data/customizer-core.js", "js/components/addon-row.js", "js/components/payment-logo.js", "js/utils/dom.js", "js/utils/format.js", "assets/icons/addon-phone.svg", "assets/icons/addon-data.svg", "assets/icons/addon-generic.svg"]) {
    assert.ok(buildScript.includes(asset), `missing production asset validation: ${asset}`);
  }
});

test("Apps Script exposes only the required public website sheets and never returns raw formulas", () => {
  for (const sheet of ["Rate Plans-Website", "Rate Plans to EOM-Website", "Rate Plans to 15-Website", "Rate Plans_OFFER-Website", "Website Settings", "Announcements", "Payment Methods", "Add-on", "Custom Pricing"]) {
    assert.ok(appsScript.includes(sheet), `missing allowlisted sheet ${sheet}`);
  }
  assert.match(appsScript, /announcements:\s*readTable_\(spreadsheet,\s*SHEET_NAMES\.announcements,\s*"announcements"\)/);
  assert.match(appsScript, /if \(kind === "announcements"\) return \[/);
  assert.match(appsScript, /aliases:\s*\["No\.",\s*"No",\s*"Number",\s*"Order"\]/);
  assert.match(appsScript, /aliases:\s*\["Value",\s*"Announcement",\s*"Text",\s*"Ad"\]/);
  assert.match(appsScript, /"Enable",\s*"Enabled",\s*"Active"/);
  assert.match(manifest, /spreadsheets\.readonly/);
  assert.match(appsScript, /function discountFromFormula_/);
  assert.match(appsScript, /record\["Discount Percent"\] = formulaDiscount/);
  assert.doesNotMatch(appsScript, /record\["Final Price Formula"\]\s*=/);
  assert.doesNotMatch(appsScript, /Payment Method-Logo/);
  assert.match(appsScript, /safeCallback_/);
  assert.doesNotMatch(appsScript, /function doPost\s*\(/);
  assert.match(manifest, /"access":\s*"ANYONE_ANONYMOUS"/);
  assert.match(manifest, /"executeAs":\s*"USER_DEPLOYING"/);
});

test("all payment-method logos are bundled locally instead of fetched from the Sheet or a remote host", async () => {
  for (const asset of ["vodafone-cash.webp", "orange-cash.webp", "instapay.webp", "telda.webp"]) {
    const file = new URL(`../public/assets/payment-methods/${asset}`, import.meta.url);
    const metadata = await stat(file);
    assert.ok(metadata.size > 500, `${asset} should contain a local image`);
  }
  assert.match(frontend, /vodafone-cash\.webp/);
  assert.match(frontend, /orange-cash\.webp/);
  assert.match(frontend, /instapay\.webp/);
  assert.match(frontend, /telda\.webp/);
  assert.match(frontend, /paymentLogoCandidates\(method, PAYMENT_ASSETS\)/);
  assert.match(frontend, /paymentMethodMark\(method\.label\)/);
});

test("route manifest declares the home page without inventing other routes", () => {
  assert.deepEqual(routeManifest.routes.map((route) => route.path), ["/"]);
  assert.equal(routeManifest.routes.length, 1);
  assert.equal(Object.keys(routeManifest).length, 1);
});

test("all frontend imports and local assets use the modular public tree", () => {
  for (const stylesheet of ["css/main.css", "css/components.css", "css/responsive.css"]) assert.ok(indexHtml.includes(stylesheet));
  assert.ok(indexHtml.includes('type="module" src="js/app.js"'));
  assert.ok(indexHtml.includes("assets/images/we-project-mark.webp"));
  assert.ok(indexHtml.includes("assets/images/sim-hero.webp"));
  assert.doesNotMatch(indexHtml, /styles\.css|data-core\.js|src="app\.js"|src="sim-hero\.webp"|href="we-project-mark\.webp"/);
  assert.doesNotMatch(frontend, /card-orb|card-category|لكل الشبكات/);
  assert.match(addonComponent, /addon-phone\.svg/);
  assert.match(addonComponent, /addon-data\.svg/);
  assert.match(addonComponent, /addon-generic\.svg/);
  assert.match(addonComponent, /row\.append\(icon, copy, price\)/);
  assert.doesNotMatch(addonComponent, /checkbox|selected|onChange|addonKey/i);
  assert.doesNotMatch(frontend, /selectedAddOns|selectedAddOnMessage|addonSelectionText|الإضافات المختارة/);
  assert.doesNotMatch(stylesheets.join("\n"), /addon-checkbox/);
  assert.match(frontend, /const PACKAGE_ACCENTS = Object\.freeze\(/);
  for (const [size, color] of [[7, "#8b3fd0"], [10, "#a34fed"], [15, "#ea3084"], [17, "#168fe2"], [20, "#31d782"], [30, "#ff951f"], [40, "#10c9d0"], [50, "#df3189"], [55, "#f7cb25"], [60, "#1d86d6"], [100, "#a34fed"]]) {
    assert.ok(frontend.includes(`${size}: "${color}"`), `missing accent for ${size} GB`);
  }
  assert.match(frontend, /PACKAGE_ACCENTS\[Number\(plan\.gb\)\]/);
  assert.match(frontend, /article\.style\.setProperty\("--accent", accent\)/);
  assert.match(stylesheets[1], /\.offer-card \{ --accent:#ad64ff;[^\n]*background: linear-gradient\(145deg,rgba\(32,22,53,\.95\),rgba\(13,9,28,\.97\)\)/);
  assert.doesNotMatch(frontend + stylesheets[1], /CATEGORY_TONES|sizeTone|\.offer-card\.(?:tone|size)-/);
  assert.ok(stylesheets[0].length > 0 && stylesheets[1].includes(".addon-row") && stylesheets[2].includes("max-width: 360px"));
});

test("the feature strip has the requested four icons and fixed information order", () => {
  const match = indexHtml.match(/<div class="features-bar"[\s\S]*?<\/div>/);
  assert.ok(match, "feature strip should be present");
  const section = match[0];
  const labels = [...section.matchAll(/<span>([^<]+)<\/span>/g)].map((entry) => entry[1]);
  assert.deepEqual(labels, ["الدفع بعد التفعيل", "1 ميجا = 1 ميجا", "1 دقيقة = 1 دقيقة لكل الشبكات", "بعد انتهاء الجيجات: 1 دقيقة = 1 ميجا"]);
  assert.equal((section.match(/class="feature-icon"/g) || []).length, 4);
  assert.doesNotMatch(section, /bar-divider|معلومات إضافية|ملاحظة/);
});

test("customizer UI is mounted beside category results and includes live synced controls", () => {
  assert.ok(indexHtml.includes('id="customizer-panel"'));
  assert.ok(indexHtml.includes("خصص باقتك بنفسك"));
  assert.ok(indexHtml.includes('data-billing="current"'));
  assert.ok(indexHtml.includes('data-billing="next"'));
  assert.ok(indexHtml.includes('id="custom-gb-range"'));
  assert.ok(indexHtml.includes('id="custom-gb-number"'));
  assert.ok(indexHtml.includes('id="custom-minutes-range"'));
  assert.ok(indexHtml.includes('id="custom-minutes-number"'));
  assert.match(indexHtml, /id="custom-duration-mode"[\s\S]*?id="custom-start-options"/);
  assert.match(indexHtml, /id="custom-minutes-number" type="text" inputmode="numeric"/);
  for (const id of ["custom-duration-total", "custom-start-date", "custom-end-date", "custom-validity-period"]) {
    assert.ok(indexHtml.includes(`id="${id}"`), `missing live validity detail ${id}`);
  }
  assert.ok(frontend.includes("calculateCustomPrice"));
  assert.ok(frontend.includes("customizer-core.js"));
  assert.match(frontend, /preserveControl: number/);
  assert.match(frontend, /control !== preserveControl/);
  assert.match(frontend, /addEventListener\("blur", commitMinutesInput\)/);
  assert.match(frontend, /const durationMax = Math\.max\(1, schedule\.maxDays \|\| 1\)/);
  assert.ok(stylesheets[1].includes(".customizer-advance-grid"));
  assert.ok(stylesheets[1].includes(".custom-duration-details"));
  assert.ok(stylesheets[2].includes(".customizer-advance-grid { grid-template-columns: minmax(0,1fr)"));
  assert.ok(frontend.includes('url.pathname === "/preview-api.js"'));
  assert.ok(buildScript.includes('hostname.toLowerCase() !== "script.google.com"'), "production builds must only accept the published Apps Script endpoint");
});

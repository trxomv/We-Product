import fs from "node:fs";
import "../public/js/data/data-core.js";
import { calculateCustomPrice } from "../public/js/data/customizer-core.js";

const raw = JSON.parse(fs.readFileSync(process.argv[2] || "/tmp/we-sheet-payload.json", "utf8"));
const data = globalThis.WEDataCore.normalizePayload(raw);
const lines = [
  "# WE Offers Customizer — Pricing Audit", "",
  `Sheet payload retrieved: ${raw.generatedAt ?? "timestamp unavailable"} (read-only).`,
  `Normalized: ${data.pricing.plans.length} regular plans, ${data.pricing.offers.length} offer rows, ${data.pricing.customRules.length} enabled Custom Pricing rules.`, "",
  "All amounts are EGP. Actual live rates and package rows were used. Test durations: 1, 6, 7, 9, 10, 15, 16, 23, 24, 25, and full month.", "",
  "## Results", "",
  "| Case | Type | GB | Minutes | Duration | Month days | Monthly ref | Applied rule | Billable days | Raw | Final |",
  "|---|---|---:|---:|---:|---:|---:|---|---:|---:|---:|",
];
function add(label, type, gb, minutes, days, monthDays, fullMonth = false) {
  const r = calculateCustomPrice({ data, gb, minutes, days, pricingMonthDays: monthDays, fullMonth });
  const rule = !r.ok ? r.reason : r.source === "offer" ? "active exact offer final price" : r.source === "standard" ? "exact regular plan final price" : minutes === 0 ? "Custom GB tier / regular duration" : gb === 0 ? "Custom minute unit rate" : days < 10 ? "existing short-duration rule" : "combined +7 days, calendar-month capped";
  lines.push(`| ${label} | ${type} | ${gb} | ${minutes} | ${fullMonth ? "Full month" : days} | ${monthDays} | ${r.ok ? r.monthlyPrice : "—"} | ${rule} | ${r.ok ? r.billableDays ?? "—" : "—"} | ${r.ok ? r.rawPrice.toFixed(2) : "—"} | ${r.ok ? r.finalPrice : "—"} |`);
}
const durations = [1, 6, 7, 9, 10, 15, 16, 23, 24, 25];
for (const gb of [1, 6, 7, 9, 10, 19, 20, 29, 30, 49, 50, 64, 65, 100]) {
  for (const day of [...durations, 30]) add("Custom GB tier", "GB-only", gb, 0, day, 30);
}
for (const gb of [10, 20, 30, 50]) {
  for (const monthDays of [28, 29, 30, 31]) {
    for (const day of [10, 16, 23, 24, 25, monthDays]) add("Custom component rates", "Combined", gb, 1100, day, monthDays);
  }
}
for (const minutes of [100, 500, 1000, 1500, 2000]) {
  for (const day of [1, 10, 23, 30]) add("Custom component rate", "Minutes-only", 0, minutes, day, 30);
}
for (const plan of data.pricing.plans.slice(0, 5)) {
  for (const day of [7, 10, 23, 24, 30]) add(`Plan #${plan.planId}`, "Exact regular", plan.gb, plan.minutes, day, 30);
}
for (const offer of data.pricing.offers.filter((item) => item.showOffer).slice(0, 5)) {
  for (const day of [7, 10, 23, 24, 30]) add(`Active offer #${offer.planId}`, "Exact active offer", offer.gb, offer.minutes, day, 30);
}
lines.push("", "## Checks and interpretation", "",
  "- GB-only custom pricing for 1–23 days deducts the fixed tier discount from the full monthly GB reference price; 1–6 GB has no discount. At 24+ days, regular GB duration pricing resumes.",
  "- Exact plan/active-offer matches are not further discounted under the custom GB tier table; offer final prices remain authoritative to avoid double discounting.",
  "- Combined cases use selected days + 7 starting at day 10, capped at actual month length; raw values are capped at monthly reference before rounding.",
  "- Minutes-only remains unit-rate priced and duration-independent. Final price rounds upward to the next 5 EGP.",
  "- Automated tests additionally exercise all discount edges, duration edges, offers, short-duration behavior, and cross-month caps.", "",
  `Audited rows: ${lines.filter((line) => line.startsWith("|")).length - 2}.`,
  `Source payload stamp: ${raw.generatedAt ?? "unknown"}.`);
fs.writeFileSync("pricing-audit-report.md", `${lines.join("\n")}\n`);
console.log(`Wrote pricing-audit-report.md with ${lines.filter((line) => line.startsWith("|")).length - 2} cases.`);

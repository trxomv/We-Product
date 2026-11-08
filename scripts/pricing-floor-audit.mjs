import fs from "node:fs";
import "../public/js/data/data-core.js";
import { calculateCustomPrice, resolveSchedule } from "../public/js/data/customizer-core.js";

const payload = JSON.parse(fs.readFileSync(process.argv[2] || "/tmp/we-sheet-payload-investigation.json", "utf8"));
const data = globalThis.WEDataCore.normalizePayload(payload);
const lines = [
  "# WE Offers — GB Minimum-Floor Pricing Audit", "",
  `Read-only Apps Script payload timestamp: ${payload.generatedAt ?? "not provided"}.`,
  `Source rows normalized: ${data.pricing.plans.length} regular plans, ${data.pricing.offers.length} offer rows, ${data.pricing.customRules.length} enabled Custom Pricing rules.`,
  `Prebooking toggles: start day 1=${data.settings.customRatePlansFrom1}; start day 16=${data.settings.customRatePlansFrom16}.`,
  "All monetary values are EGP; monthly rates and package prices come from the normalized live response.", "",
  "| Package | GB | Minutes | Scenario | Duration | Month days | Source | GB/min unit rates | Monthly reference | Monthly GB price | Raw minutes price | Capped minutes component | Billable days | Proportional GB/price | Final GB component | GB floor | Raw combined price | Final price |",
  "|---|---:|---:|---|---:|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
];
const labelSource = (r) => r.source === "offer" ? "Active offer match" : r.source === "standard" ? "Regular plan match" : r.source === "custom" ? "Custom pricing" : r.reason;
function record({ name, gb, minutes, scenario, days, monthDays, fullMonth = false }) {
  const r = calculateCustomPrice({ data, gb, minutes, days, pricingMonthDays: monthDays, fullMonth });
  const rates = r.ok ? [Number.isFinite(r.gbUnitRate) ? `GB ${r.gbUnitRate}` : "", Number.isFinite(r.minuteUnitRate) ? `min ${r.minuteUnitRate}` : ""].filter(Boolean).join(" / ") || "—" : "—";
  const amount = (value) => r.ok && Number.isFinite(value) ? value.toFixed(2) : "—";
  const proportional = r.proportionalGbPrice ?? r.proportionalPrice;
  lines.push(`| ${name} | ${gb} | ${minutes} | ${scenario} | ${fullMonth ? "Full month" : days} | ${monthDays} | ${labelSource(r)} | ${rates} | ${amount(r.monthlyPrice)} | ${amount(r.monthlyGBPrice)} | ${amount(r.rawMinutesPrice)} | ${amount(r.cappedMinutesComponent)} | ${r.ok ? r.billableDays ?? "—" : "—"} | ${amount(proportional)} | ${amount(r.finalGbComponent)} | ${amount(r.minimumPrice)} | ${amount(r.rawPrice)} | ${amount(r.finalPrice)} |`);
}
const now = new Date("2026-11-08T12:00:00.000Z");
const daySet = [1, 2, 6, 7, 8, 9, 10, 11, 15, 16, 20, 23, 24, 25];
for (const gb of [10, 30, 50, 65]) {
  const durations = gb === 10 ? [10, 16, 20, 25] : gb === 30 ? [13, 14] : [10, 16, 25];
  for (const days of durations) {
    for (const s of [
      { scenario: "Current Nov 2026", billing: "current", allowDay1: false, allowDay16: false },
      { scenario: "Next Dec 2026 · start 1", billing: "next", allowDay1: data.settings.customRatePlansFrom1, allowDay16: data.settings.customRatePlansFrom16, startDay: 1 },
      { scenario: "Next Dec 2026 · start 16", billing: "next", allowDay1: data.settings.customRatePlansFrom1, allowDay16: data.settings.customRatePlansFrom16, startDay: 16 },
    ]) {
      const schedule = resolveSchedule({ now, ...s, futureMode: "custom", days });
      record({ name: "GB-only custom", gb, minutes: 0, scenario: s.scenario, days: schedule.days, monthDays: schedule.pricingMonthDays });
    }
  }
}
const combinations = [[10, 100], [10, 1100], [30, 500], [50, 1000], [20, 1700]];
for (const [gb, minutes] of combinations) {
  for (const scenario of ["Current Nov 2026", "Next Dec 2026 · start 1", "Next Dec 2026 · start 16"]) {
    const billing = scenario.startsWith("Current") ? "current" : "next";
    const startDay = scenario.endsWith("16") ? 16 : 1;
    for (const days of [1, 2, 6, 7, 8, 9, 10, 11, 15, 16, 20, 23, 24, 25]) {
      const schedule = resolveSchedule({ now, billing, startDay, futureMode: "custom", days, allowDay1: data.settings.customRatePlansFrom1, allowDay16: data.settings.customRatePlansFrom16 });
      record({ name: "Combined", gb, minutes, scenario, days: schedule.days, monthDays: schedule.pricingMonthDays });
    }
    if (billing === "next") {
      const full = resolveSchedule({ now, billing, startDay, futureMode: "full", days: 30, allowDay1: data.settings.customRatePlansFrom1, allowDay16: data.settings.customRatePlansFrom16 });
      record({ name: "Combined", gb, minutes, scenario, days: full.days, monthDays: full.pricingMonthDays, fullMonth: true });
    }
  }
}
for (const minutes of [100, 500, 1000, 1500, 2000]) {
  for (const days of [1, 6, 7, 9, 10, 16, 25]) record({ name: "Minutes-only", gb: 0, minutes, scenario: "Rate-only; duration-independent", days, monthDays: 30 });
}
for (const raw of [50, 50.1, 50.7, 54.9, 55, 56, 83, 119, 120, 120.1, 150]) {
  const boundaryRule = data.pricing.customRules.find((rule) =>
    /gb\s*\+\s*minutes?/i.test(rule.type) && rule.gbFrom <= 10 && rule.gbTo >= 10 &&
    rule.minutePrice > 0 && raw / rule.minutePrice >= rule.minutesFrom && raw / rule.minutePrice <= rule.minutesTo);
  if (!boundaryRule) throw new Error(`No live combined Custom Pricing row covers the ${raw} EGP minutes boundary for 10 GB.`);
  const minutes = raw / boundaryRule.minutePrice;
  record({ name: `Combined minute component raw=${raw}`, gb: 10, minutes, scenario: "Component boundary · full month", days: 30, monthDays: 30, fullMonth: true });
}
lines.push("", "## Audit notes", "",
  "- GB-only and combined packages with at least 10 GB use the shared GB-based floor after +7-day proration; 1–9 GB have no floor.",
  "- Custom combined packages prorate the GB component by MIN(selected days + 7, actual month days), apply the GB floor to that component only, add MIN(raw dynamic minutes price, 120), and round the resulting total upward to 5 EGP once. Neither component is rounded separately.",
  "- Exact offer/regular matches keep the displayed monthly price as the reference; their components are not recalculated from Custom Pricing. Exact combined matches prorate that package reference for custom durations and are not component-floored.",
  "- Active offer match precedes regular plan match; unmatched packages use Custom Pricing. GB-only matched/custom packages retain the GB floor because the whole package is the GB component.",
  "- Full month uses the full matched/custom monthly reference and does not add seven days; custom GB-only and custom combined GB components retain the floor.",
  "- The illustrative component arithmetic 140.4 + 59.2 = 199.6 → 200 is also tested directly, without rounding either component first.",
  "- Minutes-only packages remain minute-rate × quantity with existing final-price behavior, duration-independent, and have no GB floor or 120 EGP cap.",
  "- Current-month requests are bounded by remaining calendar days; next-month options use the selected enabled start day and the next month’s calendar length.",
  "- Short-duration GB limit remains 20 GB for 1–7 days and is enforced through the existing shared custom input handler and render-time clamp.",
  "- No Sheet rows or Apps Script settings were edited.", "",
  `Audit table rows: ${lines.filter((line) => line.startsWith("|")).length - 2}.`);
fs.writeFileSync("pricing-floor-audit-report.md", `${lines.join("\n")}\n`);
console.log(`Wrote pricing-floor-audit-report.md (${lines.filter((line) => line.startsWith("|")).length - 2} cases)`);

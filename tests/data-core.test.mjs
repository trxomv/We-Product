import test from "node:test";
import assert from "node:assert/strict";
import "../public/js/data/data-core.js";

const core = globalThis.WEDataCore;
function rows(values) { return { headers: values.length ? Object.keys(values[0]) : [], rows: values }; }
function settings(overrides = {}) {
  const values = {
    "Show Offers Globally": { Value: "--", Enable: true },
    "Show Search": { Value: "--", Enable: true },
    "Show Last Updated": { Value: "--", Enable: true },
    "Show Copy Button": { Value: "--", Enable: true },
    "Show Share Button": { Value: "--", Enable: true },
    "WhatsApp Number": { Value: "201554551710", Enable: true },
    "WhatsApp Group URL": { Value: "https://chat.whatsapp.com/example", Enable: true },
    "Telegram Group URL": { Value: "https://t.me/example", Enable: true },
    "Auto Refresh Seconds": { Value: 15, Enable: true },
    "Announcement_1": { Value: "خصومات لفترة محدودة", Enable: true },
    "Announcement_2": { Value: "مخفي", Enable: false },
    ...overrides,
  };
  return rows(Object.entries(values).map(([key, entry]) => ({ Settings: key, ...entry })));
}
function payload({
  standard = [], eom = [], to15 = [], offers = [], announcements, siteSettings = settings(),
  paymentMethods = [
    { "Payment Method": "Payment_Vodafone_Cash", Enable: true },
    { "Payment Method": "Payment_Telda", Enable: false },
  ],
  addons = [{ Bundle: "Minutes", Quota: 1000, Price: 85 }, { Bundle: "GBs", Quota: 2, Price: 15 }],
} = {}) {
  const sheets = {
    standard: rows(standard), eom: rows(eom), to15: rows(to15), offers: rows(offers),
    settings: siteSettings, paymentMethods: rows(paymentMethods), addons: rows(addons),
  };
  if (announcements !== undefined) sheets.announcements = rows(announcements);
  return {
    ok: true,
    generatedAt: "2026-10-07T12:00:00.000Z",
    sheets,
  };
}

test("normalizes the live workbook headers and takes standard discounts only from enabled offer rows", () => {
  const data = core.normalizePayload(payload({
    standard: [{ "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Main Price": 205, Increase: 5, "Final Price": 210, Badge: "الأكثر اختيارًا", "Show Rate Plan": true }],
    eom: [{ "No. of Plan": 1, MBs: 5000, Minutes: 500, "Final Price": 170, "Tha Actual Days Left": 12, "Days Left": 12, Show: true }],
    to15: [{ "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Final Price": 100, Show: true }],
    offers: [{ "No. of Plan": 1, "Final Price": 190, "Show Offer": true, "Final Price Formula": "=CEILING(SUM(D2:E2)*90%,5)" }],
  }));
  assert.equal(data.ok, true);
  assert.equal(data.plans.standard[0].offer.finalPrice, 190);
  assert.equal(data.plans.standard[0].offer.discountPercent, 10);
  assert.equal(data.plans.eom[0].discountEligible, false);
  assert.equal(data.plans.to15[0].discountEligible, false);
  assert.equal(data.plans.all.length, 3);
});

test("reads enabled, non-empty ads from the separate Announcements sheet in No. order", () => {
  const data = core.normalizePayload(payload({
    standard: [{ "No. of Plan": 1, MBs: 1000, Minutes: 100, "Final Price": 10 }],
    announcements: [
      { "No.": 2, Value: "عرض خاص رقم 2", Enable: true },
      { "No.": 1, Value: "عرض خاص رقم 1", Enable: true },
      { "No.": 3, Value: "إعلان مخفي", Enable: false },
      { "No.": 4, Value: "", Enable: true },
      { "No.": 5, Value: "--", Enable: true },
    ],
  }));
  assert.deepEqual(data.settings.announcements, [
    { id: "1", order: 1, text: "عرض خاص رقم 1" },
    { id: "2", order: 2, text: "عرض خاص رقم 2" },
  ]);
});

test("normalizes no badge, the existing single Badge field, and multiple future badge labels", () => {
  const data = core.normalizePayload(payload({
    standard: [
      { "No. of Plan": 1, MBs: 1000, Minutes: 100, "Final Price": 10 },
      { "No. of Plan": 2, MBs: 2000, Minutes: 200, "Final Price": 20, Badge: "الأكثر اختيارًا" },
      { "No. of Plan": 3, MBs: 3000, Minutes: 300, "Final Price": 30, Badge: "أفضل قيمة | عرض مميز" },
      { "No. of Plan": 4, MBs: 4000, Minutes: 400, "Final Price": 40, "Badge Text": "جديد\nالأكثر مبيعًا" },
    ],
  }));
  assert.deepEqual(data.plans.standard.map((plan) => plan.badges), [
    [], ["الأكثر اختيارًا"], ["أفضل قيمة", "عرض مميز"], ["جديد", "الأكثر مبيعًا"],
  ]);
});

test("allows a category-specific formula discount only when its row contains an explicit offer", () => {
  const data = core.normalizePayload(payload({
    standard: [{ "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Final Price": 210 }],
    eom: [
      { "No. of Plan": 1, MBs: 5000, Minutes: 500, "Final Price": 85, Show: true, "Discount Eligible": true, "Offer Price": 85, "Final Price Formula": "=A2*85%" },
      { "No. of Plan": 2, MBs: 10000, Minutes: 1100, "Final Price": 180, Show: true, "Final Price Formula": "=CEILING(SUM(D3:E3)*H3/30,5)" },
    ],
  }));
  assert.equal(data.plans.eom[0].discountEligible, true);
  assert.equal(data.plans.eom[0].offer.discountPercent, 15);
  assert.equal(data.plans.eom[1].discountEligible, false);
});

test("honors actual Settings Enable values and derives contact visibility from enabled URL/number rows", () => {
  const data = core.normalizePayload(payload({ standard: [{ "No. of Plan": 1, MBs: 1000, Minutes: 100, "Final Price": 10 }] }));
  assert.equal(data.settings.showSearch, true);
  assert.equal(data.settings.showPlansTo15, true);
  assert.equal(data.settings.showNotes, true);
  assert.equal(data.settings.showWhatsApp, true);
  assert.equal(data.settings.showWhatsAppGroup, true);
  assert.equal(data.settings.showTelegram, true);
  assert.equal(data.settings.autoRefreshSeconds, 15);
  assert.deepEqual(data.settings.announcements.map((item) => item.text), ["خصومات لفترة محدودة"]);
  assert.deepEqual(data.settings.paymentMethods.map((item) => item.label), ["Vodafone Cash"]);
  assert.equal("logoUrl" in data.settings.paymentMethods[0], false);
  assert.deepEqual(data.addOns, [{ bundle: "Minutes", quota: 1000, price: 85 }, { bundle: "GBs", quota: 2, price: 15 }]);

  const disabled = core.normalizePayload(payload({
    standard: [{ "No. of Plan": 1, MBs: 1000, Minutes: 100, "Final Price": 10 }],
    siteSettings: settings({
      "Show Search": { Value: "--", Enable: false },
      "WhatsApp Number": { Value: "201554551710", Enable: false },
      "WhatsApp Group URL": { Value: "https://chat.whatsapp.com/example", Enable: false },
      "Telegram Group URL": { Value: "https://t.me/example", Enable: false },
    }),
    paymentMethods: [{ "Payment Method": "Payment_Telda", Enable: false }],
  }));
  assert.equal(disabled.settings.showSearch, false);
  assert.equal(disabled.settings.showWhatsApp, false);
  assert.equal(disabled.settings.showWhatsAppGroup, false);
  assert.equal(disabled.settings.showTelegram, false);
  assert.deepEqual(disabled.settings.paymentMethods, []);
});

test("shows enabled payment methods unknown to the bundled logo list by their Sheet name", () => {
  const methods = core.normalizePaymentMethods(rows([
    { "Payment Method": "Payment_Etisalt_Cash", Enable: true },
    { "Payment Method": "Payment_Custom_Wallet", Enable: true },
    { "Payment Method": "Payment_Disabled_Wallet", Enable: false },
  ]));
  assert.deepEqual(methods.map(({ label }) => label), ["Etisalat Cash", "Custom Wallet"]);
});

test("filters hidden plans and rejects ambiguous duplicate or invalid plan identifiers", () => {
  const data = core.normalizePayload(payload({ standard: [
    { "No. of Plan": 1, MBs: 1000, Minutes: 100, "Final Price": 10 },
    { "No. of Plan": 1, MBs: 2000, Minutes: 200, "Final Price": 20 },
    { "No. of Plan": 2, MBs: 2000, Minutes: 200, "Final Price": 20, "Show Rate Plan": false },
    { "No. of Plan": "Total", MBs: 3000, Minutes: 300, "Final Price": 30 },
  ] }));
  assert.equal(data.ok, false);
});

test("uses Cairo calendar boundaries for the two existing time-limited category tabs", () => {
  assert.equal(core.CATEGORY_LABELS.all, "كل الباقات");
  assert.equal(core.CATEGORY_LABELS.standard, "باقات من يوم 1 أو 16");
  assert.equal(core.CATEGORY_LABELS.eom, "باقات حتى نهاية الشهر");
  assert.equal(core.CATEGORY_LABELS.to15, "باقات حتى يوم 15");
  const ids = (date) => core.visibleCategories(core.SETTING_DEFAULTS, new Date(date)).map((entry) => entry.id);
  assert.deepEqual(ids("2026-10-07T12:00:00Z"), ["all", "standard", "to15"]);
  assert.deepEqual(ids("2026-10-08T12:00:00Z"), ["all", "standard", "eom", "to15"]);
  assert.deepEqual(ids("2026-10-22T12:00:00Z"), ["all", "standard", "eom"]);
  assert.deepEqual(ids("2026-10-23T12:00:00Z"), ["all", "standard", "eom", "to15"]);
});

test("keeps user-facing numbers Western and extracts discounts from final-price formulas", () => {
  assert.equal(core.numberValue("١٠٬٠٠٠"), 10000);
  assert.equal(core.formatGigabytes(10.5), "10.5");
  assert.equal(core.discountFromFormula("=CEILING(A2*90%,5)"), 10);
  assert.equal(core.discountFromFormula("=A2*(1-15%)"), 15);
  assert.equal(core.discountFromFormula("=A2*(1-0.15)"), 15);
  assert.equal(core.discountFromFormula("=A2-B2"), null);
});

test("builds category-aware WhatsApp subscription messages with a greeting, current price, and Western digits", () => {
  const plan = { gb: 10, minutes: 500, finalPrice: 175 };
  assert.equal(core.whatsappMessage(plan, "standard"), "السلام عليكم عايز اشترك في باقة 10 جيجا و 500 دقيقة لمدة 30 يوم من يوم 1 أو 16 بسعر 175 ج");
  assert.equal(core.whatsappMessage(plan, "eom"), "السلام عليكم عايز اشترك في باقة 10 جيجا و 500 دقيقة حتى نهاية الشهر بسعر 175 ج");
  assert.equal(core.whatsappMessage(plan, "to15"), "السلام عليكم عايز اشترك في باقة 10 جيجا و 500 دقيقة حتى يوم 15 بسعر 175 ج");
  assert.equal(core.whatsappMessage({ ...plan, currentPrice: 165 }, "to15"), "السلام عليكم عايز اشترك في باقة 10 جيجا و 500 دقيقة حتى يوم 15 بسعر 165 ج");
});

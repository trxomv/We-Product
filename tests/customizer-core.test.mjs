import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateCustomPrice, ceilToFive, maximumCustomGigabytes, minimumPriceForGigabytes,
  createWhatsAppMessage, daysInMonth, formatDate, resolveSchedule,
} from "../public/js/data/customizer-core.js";
import "../public/js/data/data-core.js";
const core = globalThis.WEDataCore;
function rows(values) { return { headers: values.length ? Object.keys(values[0]) : [], rows: values }; }
function makeData({
  standard = [{ "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Main Price": 205, Increase: 5, "Final Price": 210, "Show Rate Plan": true }],
  offers = [], customPricing = [], showOffersGlobally = true, customRulesPresent = true,
} = {}) {
  const settingRows = [
    { Settings: "Show Offers Globally", Value: "--", Enable: showOffersGlobally },
    { Settings: "Custom Rate Plans From 1", Value: "--", Enable: true },
    { Settings: "Custom Rate Plans From 16", Value: "--", Enable: false },
    { Settings: "WhatsApp Number", Value: "201555000000", Enable: true },
  ];
  const sheets = {
    standard: rows(standard), eom: rows([]), to15: rows([]), offers: rows(offers),
    settings: rows(settingRows), announcements: rows([]), paymentMethods: rows([]), addons: rows([]),
  };
  if (customRulesPresent) sheets.customPricing = rows(customPricing);
  return core.normalizePayload({ ok: true, generatedAt: "2026-11-08T12:00:00.000Z", sheets });
}
const matchOffer = { "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Main Price": 205, Increase: 5, "Final Price": 190, "Show Offer": true, "Final Price Formula": "=CEILING(SUM(D2:E2)*90%,5)" };
function price(data, { gb = 10, minutes = 1100, days = 30, monthDays = 30, fullMonth = false } = {}) {
  return calculateCustomPrice({ data, gb, minutes, days, pricingMonthDays: monthDays, fullMonth });
}
function customRule(type, gbFrom, gbTo, minutesFrom, minutesTo, gbPrice, minutePrice, Enabled = true) {
  return { Type: type, "GB From": gbFrom, "GB To": gbTo, "Minutes From": minutesFrom, "Minutes To": minutesTo, "GB Price": gbPrice, "Minute Price": minutePrice, Enabled };
}

test("normalizes booking toggles and enabled Custom Pricing rows from live sheet headers", () => {
  const data = makeData({ customPricing: [
    customRule("GB + Minutes", 1, 19, 500, 3500, "12.75", "0.06"),
    customRule("GB + Minutes", 20, 29, 500, 3500, "12", "0.05", false),
    customRule("-", "-", "-", "-", "-", "-", "-"),
  ] });
  assert.equal(data.settings.customRatePlansFrom1, true);
  assert.equal(data.settings.customRatePlansFrom16, false);
  assert.equal(data.pricing.customRulesAvailable, true);
  assert.deepEqual(data.pricing.customRules, [{ type: "GB + Minutes", gbFrom: 1, gbTo: 19, minutesFrom: 500, minutesTo: 3500, gbPrice: 12.75, minutePrice: 0.06 }]);
});

test("prefers an active exact-match offer, then the standard final price after discount", () => {
  const active = makeData({ offers: [matchOffer] });
  const offerPrice = price(active);
  assert.equal(offerPrice.source, "offer");
  assert.equal(offerPrice.monthlyPrice, 190);
  assert.equal(offerPrice.finalPrice, 190);
  const durationOffer = price(active, { days: 10, monthDays: 30 });
  assert.equal(durationOffer.source, "offer");
  assert.equal(durationOffer.monthlyPrice, 190);
  assert.equal(durationOffer.monthlyGBPrice, null);
  assert.equal(durationOffer.rawMinutesPrice, null);
  assert.equal(durationOffer.billableDays, 17);
  assert.equal(durationOffer.proportionalPrice, 190 * 17 / 30);
  assert.equal(durationOffer.finalPrice, 110);
  const noActiveOffer = makeData({ offers: [{ ...matchOffer, "Show Offer": false }] });
  assert.equal(price(noActiveOffer).source, "standard");
  assert.equal(price(noActiveOffer).finalPrice, 210);
  const durationStandard = price(noActiveOffer, { days: 10, monthDays: 30 });
  assert.equal(durationStandard.source, "standard");
  assert.equal(durationStandard.monthlyPrice, 210);
  assert.equal(durationStandard.monthlyGBPrice, null);
  assert.equal(durationStandard.proportionalPrice, 210 * 17 / 30);
  assert.equal(durationStandard.finalPrice, 120);
  const offerWithoutDimensionsButSamePlan = makeData({ offers: [{ "No. of Plan": 1, "Final Price": 190, "Show Offer": true }] });
  assert.equal(price(offerWithoutDimensionsButSamePlan).finalPrice, 190);
  const fractionalStandard = makeData({ standard: [{ "No. of Plan": 1, MBs: 10000, Minutes: 1100, "Final Price": 201, "Show Rate Plan": true }] });
  const proratedStandard = price(fractionalStandard, { days: 12 });
  assert.equal(proratedStandard.monthlyPrice, 201);
  assert.equal(proratedStandard.proportionalPrice, 201 * 19 / 30);
  assert.equal(proratedStandard.minimumPrice, null);
  assert.equal(proratedStandard.rawPrice, 201 * 19 / 30);
  assert.equal(proratedStandard.finalPrice, 130);
  const fractionalOffer = makeData({ offers: [{ ...matchOffer, "Final Price": 201 }] });
  assert.equal(price(fractionalOffer, { days: 12 }).finalPrice, 130);
  assert.equal(price(makeData({ offers: [matchOffer], showOffersGlobally: false })).source, "standard");
});

test("falls back to Custom Pricing only after plans fail and adds both mixed components once", () => {
  const data = makeData({ customPricing: [
    customRule("GB + Minutes", 30, 49, 500, 3500, "12", "0.09"),
    customRule("GB + Minutes", 30, 49, 3501, 5000, "12", "0.09", false),
  ] });
  const combined = price(data, { gb: 35, minutes: 1800, days: 30 });
  assert.equal(combined.source, "custom");
  assert.equal(combined.monthlyGBPrice, 420);
  assert.equal(combined.rawMinutesPrice, 162);
  assert.equal(combined.cappedMinutesComponent, 120);
  assert.equal(combined.monthlyPrice, 540);
  assert.equal(combined.finalPrice, 540);
  const prorated = price(data, { gb: 35, minutes: 1800, days: 12, monthDays: 31 });
  assert.ok(Math.abs(prorated.proportionalGbPrice - 420 * 19 / 31) < 1e-9);
  assert.equal(prorated.finalGbComponent, 300);
  assert.equal(prorated.rawPrice, 420);
  assert.equal(prorated.finalPrice, 420);
  assert.equal(price(data, { gb: 35, minutes: 4000 }).ok, false);
  assert.equal(price(makeData({ customRulesPresent: false }), { gb: 35, minutes: 1800 }).reason, "source-unavailable");
});

test("applies proportional duration pricing and GB-only minimum floors instead of legacy discounts", () => {
  const data = makeData({
    customPricing: [customRule("GB Only", 1, 100, 0, 0, "10", "0")],
  });
  assert.equal(price(data, { gb: 5, minutes: 0, days: 1 }).finalPrice, 15);
  assert.equal(price(data, { gb: 9, minutes: 0, days: 23 }).finalPrice, 90);
  assert.equal(price(data, { gb: 12, minutes: 0, days: 1 }).finalPrice, 140);
  assert.equal(price(data, { gb: 12, minutes: 0, days: 23 }).finalPrice, 140);
  assert.equal(price(data, { gb: 12, minutes: 0, days: 24 }).finalPrice, 140);
  assert.equal(price(data, { gb: 20, minutes: 0, days: 15 }).finalPrice, 180);
  const discountedMatched = makeData({ standard: [{ "No. of Plan": 2, MBs: 12000, Minutes: 0, "Final Price": 200, "Show Rate Plan": true }] });
  assert.equal(price(discountedMatched, { gb: 12, minutes: 0, days: 7 }).source, "standard");
  assert.equal(price(discountedMatched, { gb: 12, minutes: 0, days: 7 }).monthlyPrice, 200);
  assert.equal(price(discountedMatched, { gb: 12, minutes: 0, days: 7 }).finalPrice, 140);
});

test("audits all new GB-floor boundaries and applies the same floors to combined packages only", () => {
  const data = makeData({ customPricing: [
    customRule("GB Only", 1, 100, 0, 0, 10, 0),
    customRule("GB + Minutes", 1, 100, 1, 5000, 10, 0.1),
    customRule("Minutes Only", 0, 0, 1, 5000, 0, 0.1),
  ] });
  const boundaries = [1, 6, 9, 10, 19, 20, 29, 30, 49, 50, 64, 65, 100];
  for (const gb of boundaries) {
    const result = price(data, { gb, minutes: 0, days: 16 });
    assert.equal(result.minimumPrice, minimumPriceForGigabytes(gb), `${gb} GB floor`);
    assert.ok(Math.abs(result.rawPrice - Math.max(gb * 10 * 23 / 30, result.minimumPrice)) < 1e-9, `${gb} GB price`);
    assert.equal(result.finalPrice, ceilToFive(result.rawPrice), `${gb} GB rounded`);
  }
  const combined = price(data, { gb: 10, minutes: 500, days: 10, monthDays: 30 });
  assert.equal(combined.monthlyPrice, 150);
  assert.equal(combined.billableDays, 17);
  assert.ok(Math.abs(combined.proportionalGbPrice - 100 * 17 / 30) < 1e-9);
  assert.equal(combined.finalGbComponent, 130);
  assert.equal(combined.cappedMinutesComponent, 50);
  assert.equal(combined.minimumPrice, 130);
  assert.equal(combined.rawPrice, 180);
  assert.equal(combined.finalPrice, 180);
  const minutes = price(data, { gb: 0, minutes: 500, days: 16 });
  assert.equal(minutes.rawPrice, 50);
  assert.equal(minutes.finalPrice, 50);
});

test("minimum floor formulas match every tier boundary; full month skips the +7 duration uplift", () => {
  const expectedFloors = new Map([[9, 0], [10, 130], [19, 175], [20, 180], [29, 225], [30, 250], [49, 440], [50, 450], [64, 520], [65, 525], [100, 700]]);
  for (const [gb, expected] of expectedFloors) assert.equal(minimumPriceForGigabytes(gb), expected, `${gb} GB`);
  const data = makeData({ customPricing: [customRule("GB Only", 10, 100, 0, 0, 1, 0)] });
  const customFullMonth = price(data, { gb: 10, minutes: 0, days: 30, monthDays: 30, fullMonth: true });
  assert.equal(customFullMonth.monthlyPrice, 10);
  assert.equal(customFullMonth.billableDays, null);
  assert.equal(customFullMonth.rawPrice, 130);
  assert.equal(customFullMonth.finalPrice, 130);
  const activeFullMonth = price(makeData({ offers: [matchOffer] }), { gb: 10, minutes: 1100, fullMonth: true });
  assert.equal(activeFullMonth.monthlyPrice, 190);
  assert.equal(activeFullMonth.rawPrice, 190);
  assert.equal(activeFullMonth.finalPrice, 190);
});

test("combined duration caps use actual month lengths and apply the floor only to the GB component", () => {
  const data = makeData({ customPricing: [customRule("GB + Minutes", 10, 10, 1000, 1000, 12, 0.1)] });
  for (const monthDays of [28, 29, 30, 31]) {
    const monthlyReference = 220;
    const cappedDays = price(data, { gb: 10, minutes: 1000, days: monthDays, monthDays });
    assert.equal(cappedDays.billableDays, monthDays);
    assert.equal(cappedDays.monthlyPrice, monthlyReference);
    assert.equal(cappedDays.finalGbComponent, 130);
    assert.equal(cappedDays.cappedMinutesComponent, 100);
    assert.equal(cappedDays.rawPrice, 230);
    for (const days of [10, 15, 16, 23, 24, 25, monthDays]) {
      const result = price(data, { gb: 10, minutes: 1000, days, monthDays });
      assert.equal(result.billableDays, Math.min(days + 7, monthDays));
      assert.equal(result.finalGbComponent, 130);
      assert.equal(result.rawPrice, 230);
      assert.equal(result.finalPrice, ceilToFive(result.rawPrice));
    }
  }
});

test("prices minutes-only packages from the Sheet unit rate without applying GB or duration rules", () => {
  const data = makeData({ customPricing: [customRule("Minutes Only", 0, 0, 1, 5000, 0, "0.105")] });
  const atOneDay = price(data, { gb: 0, minutes: 1100, days: 1 });
  const atTwentyDays = price(data, { gb: 0, minutes: 1100, days: 20 });
  assert.equal(atOneDay.source, "custom");
  assert.equal(atOneDay.finalPrice, 120);
  assert.equal(atTwentyDays.finalPrice, 120);
  const highMinutes = price(data, { gb: 0, minutes: 2000, days: 20 });
  assert.equal(highMinutes.monthlyPrice, 210);
  assert.equal(highMinutes.finalPrice, 210);
  assert.equal(highMinutes.minimumPrice, undefined);
  assert.equal(highMinutes.cappedMinutesComponent, null);
});

test("rounds and caps the minute component only for custom combined packages", () => {
  const data = makeData({ customPricing: [
    customRule("GB + Minutes", 10, 10, 1, 1000, 12.5, 1),
    customRule("Minutes Only", 0, 0, 1, 1000, 0, 1),
  ] });
  const cases = [[50, 50], [50.1, 50.1], [50.7, 50.7], [54.9, 54.9], [55, 55], [56, 56], [83, 83], [119, 119], [120, 120], [120.1, 120], [150, 120]];
  for (const [rawMinutes, expectedComponent] of cases) {
    const result = price(data, { gb: 10, minutes: rawMinutes, days: 30, fullMonth: true });
    assert.equal(result.monthlyGBPrice, 125);
    assert.equal(result.rawMinutesPrice, rawMinutes);
    assert.equal(result.cappedMinutesComponent, expectedComponent, `raw minutes ${rawMinutes}`);
    assert.equal(result.monthlyPrice, 125 + expectedComponent);
    assert.equal(result.finalGbComponent, 130);
    assert.equal(result.rawPrice, 130 + expectedComponent);
    assert.equal(result.finalPrice, ceilToFive(130 + expectedComponent));
  }
  const minutesOnly = price(data, { gb: 0, minutes: 150, days: 30 });
  assert.equal(minutesOnly.monthlyPrice, 150);
  assert.equal(minutesOnly.finalPrice, 150);
  assert.equal(minutesOnly.cappedMinutesComponent, null);
  assert.equal(minutesOnly.minimumPrice, undefined);
});

test("rounds a combined package only once after adding its unrounded components", () => {
  const data = makeData({ customPricing: [customRule("GB + Minutes", 10, 10, 50, 100, 14.04, 1)] });
  const result = price(data, { gb: 10, minutes: 59.2, days: 30, fullMonth: true });
  assert.equal(result.monthlyGBPrice, 140.4);
  assert.equal(result.rawMinutesPrice, 59.2);
  assert.equal(result.cappedMinutesComponent, 59.2);
  assert.equal(result.finalGbComponent, 140.4);
  assert.equal(result.rawPrice, 199.6);
  assert.equal(result.finalPrice, 200);
});

test("applies selected days plus seven to exact-match monthly references without component re-pricing", () => {
  const data = makeData({ standard: [{ "No. of Plan": 8, MBs: 20000, Minutes: 5000, "Final Price": 100.1, "Show Rate Plan": true }] });
  const expected = new Map([[1, 30], [6, 45], [7, 50], [9, 55], [10, 60], [11, 65], [15, 75]]);
  for (const [days, finalPrice] of expected) {
    assert.equal(price(data, { gb: 20, minutes: 5000, days, monthDays: 30 }).finalPrice, finalPrice, `${days} days`);
  }
  assert.equal(price(data, { gb: 20, minutes: 5000, days: 7 }).rawPrice, 100.1 * 14 / 30);
  assert.equal(price(data, { gb: 20, minutes: 5000, days: 10 }).billableDays, 17);
  assert.equal(price(data, { gb: 20, minutes: 5000, days: 11 }).billableDays, 18);
  assert.equal(price(data, { gb: 20, minutes: 5000, days: 15 }).billableDays, 22);
});

test("respects rounding examples, monthly cap, and full-month package price", () => {
  assert.equal(ceilToFive(142.3), 145);
  assert.equal(ceilToFive(147), 150);
  assert.equal(ceilToFive(151.5), 155);
  assert.equal(ceilToFive(200), 200);
  assert.equal(ceilToFive(582), 585);
  assert.equal(ceilToFive(580), 580);
  assert.ok(Number.isNaN(ceilToFive(-1)));
  const data = makeData({ standard: [{ "No. of Plan": 8, MBs: 50000, Minutes: 5000, "Final Price": 900, "Show Rate Plan": true }] });
  const capped = price(data, { gb: 50, minutes: 5000, days: 25, monthDays: 28 });
  assert.equal(capped.finalPrice, 900);
  assert.equal(price(data, { gb: 50, minutes: 5000, fullMonth: true }).finalPrice, 900);
});

test("rounds every price source and duration result upward to the next five after calculation", () => {
  const standard = makeData({ standard: [{ "No. of Plan": 9, MBs: 10000, Minutes: 1100, "Final Price": 142.3, "Show Rate Plan": true }] });
  assert.equal(price(standard, { days: 30, fullMonth: true }).finalPrice, 145);

  const activeOffer = makeData({ offers: [{ ...matchOffer, "Final Price": 142.3 }] });
  assert.equal(price(activeOffer, { days: 30, fullMonth: true }).finalPrice, 145);

  const custom = makeData({ customPricing: [customRule("GB + Minutes", 1, 2, 500, 500, 142.3, 0)] });
  assert.equal(price(custom, { gb: 1, minutes: 500, days: 30, fullMonth: true }).finalPrice, 145);
  assert.equal(price(custom, { gb: 1, minutes: 500, days: 7 }).finalPrice, 70);

  const gbOnly = makeData({ customPricing: [customRule("GB Only", 1, 1, 0, 0, 142.3, 0)] });
  assert.equal(price(gbOnly, { gb: 1, minutes: 0, days: 2 }).finalPrice, 45);

  const minutesOnly = makeData({ customPricing: [customRule("Minutes Only", 0, 0, 1400, 1400, 0, 0.105)] });
  assert.equal(price(minutesOnly, { gb: 0, minutes: 1400, days: 20 }).finalPrice, 150);
});

test("limits GB to 20 for durations 1–7 days and restores the original range after day 7", () => {
  for (let days = 1; days <= 7; days += 1) assert.equal(maximumCustomGigabytes(days), 20);
  assert.equal(maximumCustomGigabytes(8), 100);
  assert.equal(maximumCustomGigabytes(7, { fullMonth: true }), 100);
});

test("uses actual next-month duration maxima for start days 1 and 16 in 28/29/30/31-day months", () => {
  const months = [
    { now: "2027-01-10T12:00:00.000Z", monthDays: 28 },
    { now: "2028-01-10T12:00:00.000Z", monthDays: 29 },
    { now: "2027-03-10T12:00:00.000Z", monthDays: 30 },
    { now: "2027-04-10T12:00:00.000Z", monthDays: 31 },
  ];
  for (const { now, monthDays: expectedDays } of months) {
    for (const startDay of [1, 16]) {
      const schedule = resolveSchedule({
        now: new Date(now), billing: "next", futureMode: "custom", startDay, days: 60,
        allowDay1: true, allowDay16: true,
      });
      assert.equal(schedule.pricingMonthDays, expectedDays, `${now}, start ${startDay}`);
      assert.equal(schedule.maxDays, expectedDays, `${now}, start ${startDay}`);
      assert.equal(schedule.days, expectedDays, `${now}, start ${startDay}`);
      assert.equal(daysBetweenDates(schedule.start, schedule.end), expectedDays, `${now}, start ${startDay}`);
    }
  }
});

function daysBetweenDates(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

test("uses real month lengths and inclusive current-month and future-booking dates", () => {
  assert.equal(daysInMonth(2027, 2), 28);
  assert.equal(daysInMonth(2028, 2), 29);
  assert.equal(daysInMonth(2026, 4), 30);
  assert.equal(daysInMonth(2026, 1), 31);
  const now = new Date("2028-01-20T12:00:00.000Z");
  const current = resolveSchedule({ now, billing: "current", days: 30 });
  assert.equal(current.days, 12);
  assert.equal(formatDate(current.start), "20/01/2028");
  assert.equal(formatDate(current.end), "31/01/2028");
  const februaryFull = resolveSchedule({ now, billing: "next", futureMode: "full", startDay: 1, allowDay1: true, allowDay16: true });
  assert.equal(formatDate(februaryFull.start), "01/02/2028");
  assert.equal(formatDate(februaryFull.end), "29/02/2028");
  assert.equal(februaryFull.days, 29);
  const februaryHalf = resolveSchedule({ now, billing: "next", futureMode: "full", startDay: 16, allowDay16: true });
  assert.equal(formatDate(februaryHalf.start), "16/02/2028");
  assert.equal(formatDate(februaryHalf.end), "15/03/2028");
  assert.equal(februaryHalf.days, 29);
  const ordinaryFebruary = resolveSchedule({ now: new Date("2027-01-20T12:00:00.000Z"), billing: "next", futureMode: "full", startDay: 16, allowDay16: true });
  assert.equal(formatDate(ordinaryFebruary.end), "15/03/2027");
  assert.equal(ordinaryFebruary.days, 28);
});

test("uses the calculated UI price in the WhatsApp order and respects disabled advance booking", () => {
  const unavailable = resolveSchedule({ billing: "next", allowDay1: false, allowDay16: false });
  assert.equal(unavailable.valid, false);
  const schedule = resolveSchedule({ now: new Date("2026-11-08T12:00:00.000Z"), billing: "next", futureMode: "custom", startDay: 16, days: 12, allowDay16: true });
  const calculated = price(makeData({ offers: [matchOffer] }), { days: 11 });
  const message = createWhatsAppMessage({ gb: 10, minutes: 1100, schedule, price: calculated.finalPrice });
  assert.match(message, /10 جيجا و 1,100 دقيقة/);
  assert.match(message, /لمدة 12 يوم بداية من يوم 16 الشهر القادم/);
  assert.ok(message.includes(`${calculated.finalPrice} جنيه`));
  assert.match(message, /من 16\/12\/2026 إلى 27\/12\/2026/);
  assert.equal(createWhatsAppMessage({ gb: 10, minutes: 500, schedule: unavailable, price: 175 }), "");
});

const DAY_MS = 24 * 60 * 60 * 1000;
const CUSTOM_DURATION_MAX = 60;
const CUSTOM_GB_MAX = 100;
const SHORT_DURATION_GB_MAX = 20;
function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}
function closeEnough(left, right) {
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 1e-9;
}
function precisePrice(value) {
  return Number.isFinite(value) ? Number(value.toFixed(10)) : value;
}
export function ceilToFive(value) {
  if (!Number.isFinite(value) || value < 0) return NaN;
  return Math.ceil(value / 5) * 5;
}
export function maximumCustomGigabytes(days, { fullMonth = false } = {}) {
  const selectedDays = Number(days);
  return !fullMonth && Number.isInteger(selectedDays) && selectedDays >= 1 && selectedDays <= 7
    ? SHORT_DURATION_GB_MAX
    : CUSTOM_GB_MAX;
}
export function daysInMonth(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return 0;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function cairoParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
  return { year: values.year, month: values.month, day: values.day };
}
function utcDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}
function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}
function daysBetweenInclusive(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
}
export function formatDate(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
export function resolveSchedule({
  now = new Date(), billing = "current", futureMode = "custom", startDay = 1,
  days = 30, allowDay1 = false, allowDay16 = false,
} = {}) {
  const today = cairoParts(now);
  const currentMonthDays = daysInMonth(today.year, today.month);
  if (billing === "current") {
    const maxDays = Math.max(0, currentMonthDays - today.day + 1);
    const selectedDays = Math.min(maxDays, Math.max(1, Math.trunc(Number(days) || 1)));
    const start = utcDate(today.year, today.month, today.day);
    const end = addDays(start, selectedDays - 1);
    return {
      valid: maxDays > 0, billing, fullMonth: false, start, end, days: selectedDays,
      maxDays, pricingMonthDays: currentMonthDays, startDay: today.day,
      month: today.month, year: today.year, description: `الشهر الحالي · ${selectedDays} يوم`,
    };
  }
  const allowedStarts = [allowDay1 ? 1 : null, allowDay16 ? 16 : null].filter(Boolean);
  if (billing !== "next" || !allowedStarts.length) return { valid: false, billing, fullMonth: futureMode === "full", allowedStarts };
  const chosenStartDay = allowedStarts.includes(Number(startDay)) ? Number(startDay) : allowedStarts[0];
  const nextMonth = new Date(Date.UTC(today.year, today.month, 1));
  const year = nextMonth.getUTCFullYear();
  const month = nextMonth.getUTCMonth() + 1;
  const start = utcDate(year, month, chosenStartDay);
  const monthDays = daysInMonth(year, month);
  if (futureMode === "full") {
    const end = chosenStartDay === 1
      ? utcDate(year, month, monthDays)
      : utcDate(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 15);
    return {
      valid: true, billing, fullMonth: true, start, end, days: daysBetweenInclusive(start, end),
      maxDays: daysBetweenInclusive(start, end), pricingMonthDays: monthDays,
      startDay: chosenStartDay, month, year, description: `شهر كامل · من يوم ${chosenStartDay}`,
    };
  }
  const maxDays = monthDays;
  const selectedDays = Math.min(maxDays, Math.max(1, Math.trunc(Number(days) || 1)));
  const end = addDays(start, selectedDays - 1);
  return {
    valid: true, billing, fullMonth: false, start, end, days: selectedDays, maxDays,
    pricingMonthDays: monthDays, startDay: chosenStartDay, month, year,
    description: `الشهر القادم · بداية يوم ${chosenStartDay} · ${selectedDays} يوم`,
  };
}
function exactPlan(data, gb, minutes) {
  const plans = data?.pricing?.plans ?? data?.plans?.standard ?? [];
  return plans.find((plan) => closeEnough(plan.gb, gb) && closeEnough(plan.minutes, minutes)) ?? null;
}
function activeExactOffer(data, gb, minutes, plan) {
  if (data?.pricing?.offersEnabled !== true) return null;
  return (data?.pricing?.offers ?? []).find((offer) =>
    offer.showOffer === true && finitePositive(offer.finalPrice) &&
    ((Number.isFinite(offer.gb) && Number.isFinite(offer.minutes) && closeEnough(offer.gb, gb) && closeEnough(offer.minutes, minutes)) ||
      (!Number.isFinite(offer.gb) && !Number.isFinite(offer.minutes) && plan && String(offer.planId) === String(plan.planId)))) ?? null;
}
function ruleKind(type = "") {
  const normalized = String(type).toLowerCase().replace(/[\s_-]+/g, " ").trim();
  if (/gb\s*\+\s*minutes?|gb\s+and\s+minutes?/.test(normalized)) return "combined";
  if (/minutes?\s+only|only\s+minutes?/.test(normalized)) return "minutes";
  if (/gb\s+only|only\s+gb/.test(normalized)) return "gb";
  return "";
}
function within(value, low, high) {
  return Number.isFinite(low) && Number.isFinite(high) && value >= low && value <= high;
}
function findCustomRule(data, kind, gb, minutes) {
  const rules = data?.pricing?.customRules ?? [];
  return rules.find((item) => {
    const rowKind = ruleKind(item.type);
    if (rowKind !== kind && rowKind !== "combined") return false;
    if (kind === "combined") {
      return rowKind === "combined" && gb > 0 && minutes > 0 &&
        within(gb, item.gbFrom, item.gbTo) && within(minutes, item.minutesFrom, item.minutesTo);
    }
    if (kind === "gb") return gb > 0 && within(gb, item.gbFrom, item.gbTo);
    if (kind === "minutes") return minutes > 0 && within(minutes, item.minutesFrom, item.minutesTo);
    return false;
  }) ?? null;
}
function customMonthlyPrice(data, gb, minutes) {
  if (gb > 0 && minutes > 0) {
    const combined = findCustomRule(data, "combined", gb, minutes);
    if (combined) return combinedMonthlyPrice(gb, minutes, combined.gbPrice, combined.minutePrice);
    const gbRule = findCustomRule(data, "gb", gb, minutes);
    const minuteRule = findCustomRule(data, "minutes", gb, minutes);
    if (gbRule && minuteRule) return combinedMonthlyPrice(gb, minutes, gbRule.gbPrice, minuteRule.minutePrice);
    return { monthlyRawPrice: NaN, source: "unavailable", plan: null };
  }
  if (gb > 0) {
    const rule = findCustomRule(data, "gb", gb, minutes);
    return rule ? { monthlyRawPrice: gb * rule.gbPrice, monthlyGBPrice: gb * rule.gbPrice, gbUnitRate: rule.gbPrice, source: "custom", plan: null } : { monthlyRawPrice: NaN, source: "unavailable", plan: null };
  }
  if (minutes > 0) {
    const rule = findCustomRule(data, "minutes", gb, minutes);
    return rule ? { monthlyRawPrice: minutes * rule.minutePrice, rawMinutesPrice: minutes * rule.minutePrice, minuteUnitRate: rule.minutePrice, source: "custom", plan: null } : { monthlyRawPrice: NaN, source: "unavailable", plan: null };
  }
  return { monthlyRawPrice: NaN, source: "unavailable", plan: null };
}
function combinedMonthlyPrice(gb, minutes, gbRate, minuteRate) {
  const monthlyGBPrice = precisePrice(gb * gbRate);
  const rawMinutesPrice = precisePrice(minutes * minuteRate);
  const cappedMinutesComponent = Math.min(120, rawMinutesPrice);
  return {
    monthlyRawPrice: precisePrice(monthlyGBPrice + cappedMinutesComponent),
    monthlyGBPrice,
    gbUnitRate: gbRate,
    minuteUnitRate: minuteRate,
    rawMinutesPrice,
    cappedMinutesComponent,
    source: "custom",
    plan: null,
  };
}
function monthlyBasePrice(data, gb, minutes) {
  const plan = exactPlan(data, gb, minutes);
  const offer = activeExactOffer(data, gb, minutes, plan);
  if (offer) return { monthlyRawPrice: offer.finalPrice, source: "offer", plan };
  if (plan && finitePositive(plan.finalPrice)) return { monthlyRawPrice: plan.finalPrice, source: "standard", plan };
  return customMonthlyPrice(data, gb, minutes);
}
export function minimumPriceForGigabytes(gb) {
  if (gb >= 10 && gb <= 19) return 130 + (gb - 10) * 5;
  if (gb >= 20 && gb <= 29) return 180 + (gb - 20) * 5;
  if (gb >= 30 && gb <= 49) return 250 + (gb - 30) * 10;
  if (gb >= 50 && gb <= 64) return 450 + (gb - 50) * 5;
  if (gb >= 65 && gb <= 100) return 525 + (gb - 65) * 5;
  return 0;
}
export function calculateCustomPrice({ data, gb, minutes, days, pricingMonthDays, fullMonth = false } = {}) {
  const normalizedGb = Number(gb);
  const normalizedMinutes = Number(minutes);
  const normalizedDays = Math.trunc(Number(days));
  if (!Number.isFinite(normalizedGb) || normalizedGb < 0 || !Number.isFinite(normalizedMinutes) || normalizedMinutes < 0) {
    return { ok: false, reason: "invalid", monthlyPrice: NaN, finalPrice: NaN };
  }
  const monthly = monthlyBasePrice(data, normalizedGb, normalizedMinutes);
  if (!finitePositive(monthly.monthlyRawPrice)) {
    const sourceUnavailable = data?.pricing?.customRulesAvailable !== true && !monthly.plan;
    return { ok: false, reason: sourceUnavailable ? "source-unavailable" : "no-match", monthlyPrice: NaN, finalPrice: NaN };
  }
  const monthlyPrice = monthly.monthlyRawPrice;
  // Minute-only pricing is unit-priced from Custom Pricing and is independent of duration.
  if (normalizedGb === 0) {
    return {
      ok: true, source: monthly.source, monthlyPrice, monthlyGBPrice: monthly.monthlyGBPrice ?? null,
      gbUnitRate: null, minuteUnitRate: monthly.minuteUnitRate ?? null,
      rawMinutesPrice: monthly.rawMinutesPrice ?? null, cappedMinutesComponent: null, rawPrice: monthly.monthlyRawPrice,
      finalPrice: ceilToFive(monthly.monthlyRawPrice), billableDays: null, plan: monthly.plan,
    };
  }
  const minimumPrice = minimumPriceForGigabytes(normalizedGb);
  const customCombined = monthly.source === "custom" && normalizedMinutes > 0 && Number.isFinite(monthly.monthlyGBPrice);
  const hasGbComponent = customCombined || normalizedMinutes === 0;
  if (fullMonth) {
    const proportionalGbPrice = hasGbComponent ? (monthly.monthlyGBPrice ?? monthlyPrice) : null;
    const finalGbComponent = hasGbComponent ? Math.max(proportionalGbPrice, minimumPrice) : null;
    const rawPrice = customCombined
      ? precisePrice(finalGbComponent + monthly.cappedMinutesComponent)
      : normalizedMinutes === 0 ? finalGbComponent : monthlyPrice;
    return {
      ok: true, source: monthly.source, monthlyPrice, proportionalPrice: monthlyPrice,
      monthlyGBPrice: monthly.monthlyGBPrice ?? (normalizedMinutes === 0 ? monthlyPrice : null), gbUnitRate: monthly.gbUnitRate ?? null,
      minuteUnitRate: monthly.minuteUnitRate ?? null, rawMinutesPrice: monthly.rawMinutesPrice ?? null,
      cappedMinutesComponent: monthly.cappedMinutesComponent ?? null,
      proportionalGbPrice, finalGbComponent,
      minimumPrice: hasGbComponent ? minimumPrice : null,
      rawPrice,
      finalPrice: ceilToFive(rawPrice), billableDays: null, plan: monthly.plan,
    };
  }
  const monthDays = Number(pricingMonthDays);
  if (!Number.isFinite(normalizedDays) || normalizedDays < 1 || !Number.isInteger(normalizedDays) || !Number.isFinite(monthDays) || monthDays < 28 || monthDays > 31) {
    return { ok: false, reason: "invalid-duration", monthlyPrice, finalPrice: NaN };
  }
  const billableDays = Math.min(normalizedDays + 7, monthDays);
  const proportionalGbPrice = hasGbComponent
    ? precisePrice((monthly.monthlyGBPrice ?? monthlyPrice) * billableDays / monthDays)
    : null;
  const finalGbComponent = hasGbComponent ? Math.max(proportionalGbPrice, minimumPrice) : null;
  const proportionalPrice = hasGbComponent ? proportionalGbPrice : monthlyPrice * billableDays / monthDays;
  const rawPrice = customCombined
    ? precisePrice(finalGbComponent + monthly.cappedMinutesComponent)
    : normalizedMinutes === 0 ? finalGbComponent : proportionalPrice;
  return {
    ok: true, source: monthly.source, monthlyPrice, monthlyGBPrice: monthly.monthlyGBPrice ?? (normalizedMinutes === 0 ? monthlyPrice : null),
    gbUnitRate: monthly.gbUnitRate ?? null, minuteUnitRate: monthly.minuteUnitRate ?? null,
    rawMinutesPrice: monthly.rawMinutesPrice ?? null, cappedMinutesComponent: monthly.cappedMinutesComponent ?? null,
    proportionalGbPrice, finalGbComponent,
    proportionalPrice, minimumPrice: hasGbComponent ? minimumPrice : null, rawPrice,
    finalPrice: ceilToFive(rawPrice), billableDays, plan: monthly.plan,
  };
}
export function createWhatsAppMessage({ gb, minutes, schedule, price } = {}) {
  if (!schedule?.valid || !finitePositive(Number(price))) return "";
  const amount = Number(gb).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const minuteCount = Number(minutes).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const finalPrice = Number(price).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const validity = schedule.fullMonth
    ? `حجز شهر كامل بداية من يوم ${schedule.startDay} الشهر القادم (من ${formatDate(schedule.start)} إلى ${formatDate(schedule.end)})`
    : schedule.billing === "next"
      ? `لمدة ${schedule.days} يوم بداية من يوم ${schedule.startDay} الشهر القادم (من ${formatDate(schedule.start)} إلى ${formatDate(schedule.end)})`
      : `لمدة ${schedule.days} يوم من ${formatDate(schedule.start)} إلى ${formatDate(schedule.end)}`;
  return `السلام عليكم، عايز أشترك في باقة الـ ${amount} جيجا و ${minuteCount} دقيقة ${validity}، بسعر ${finalPrice} جنيه.`;
}
export const CUSTOM_DURATION_MAX_DAYS = CUSTOM_DURATION_MAX;
export const CUSTOM_GIGABYTE_MAX = CUSTOM_GB_MAX;
export const SHORT_DURATION_GIGABYTE_MAX = SHORT_DURATION_GB_MAX;

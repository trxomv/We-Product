(function attachDataCore(root) {
  "use strict";

  const DEFAULT_REFRESH_SECONDS = 300;
  const CATEGORY_LABELS = Object.freeze({
    all: "كل الباقات",
    standard: "باقات من يوم 1 أو 16",
    eom: "باقات حتى نهاية الشهر",
    to15: "باقات حتى يوم 15",
  });
  const SETTING_DEFAULTS = Object.freeze({
    showOffersGlobally: false,
    showPlansTo15: true,
    showNotes: true,
    showWhatsApp: false,
    showWhatsAppGroup: false,
    showTelegram: false,
    showSearch: false,
    showLastUpdated: false,
    showCopyButton: false,
    showShareButton: false,
    autoRefreshSeconds: DEFAULT_REFRESH_SECONDS,
    whatsappNumber: "",
    whatsappGroupUrl: "",
    telegramGroupUrl: "",
    announcements: [],
    paymentMethods: [],
  });

  function normalizeText(value) {
    return String(value ?? "").normalize("NFKC").replace(/[\u200e\u200f\u202a-\u202e]/g, "").trim();
  }

  function latinDigits(value) {
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    const persian = "۰۱۲۳۴۵۶۷۸۹";
    return String(value ?? "").replace(/[٠-٩۰-۹]/g, (digit) => {
      const arabicIndex = arabic.indexOf(digit);
      return String(arabicIndex >= 0 ? arabicIndex : persian.indexOf(digit));
    });
  }

  function normalizeHeader(value) {
    return normalizeText(value)
      .toLowerCase()
      .replace(/[\u064b-\u065f\u0670]/g, "")
      .replace(/[.]/g, "")
      .replace(/[\s-]+/g, "_");
  }

  function numberValue(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
    const cleaned = latinDigits(value).replace(/[٬,]/g, "").replace(/٫/g, ".").replace(/[^0-9.+-]/g, "");
    if (!cleaned) return NaN;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function normalizeSearchText(value) {
    return latinDigits(normalizeText(value)).replace(/[٬,]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function booleanValue(value, fallback = false) {
    if (value === true || value === false) return value;
    const normalized = normalizeText(value).toLowerCase();
    if (["true", "1", "yes", "y", "نعم", "مفعل", "مفعّل", "نشط", "نشطة"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "لا", "معطل", "معطّل", "غير مفعل", "غير مفعّل"].includes(normalized)) return false;
    return fallback;
  }

  function pick(record, aliases) {
    const wanted = new Set(aliases.map(normalizeHeader));
    for (const [header, value] of Object.entries(record ?? {})) {
      if (wanted.has(normalizeHeader(header))) return value;
    }
    return undefined;
  }

  function hasValue(value) {
    return value !== undefined && value !== null && normalizeText(value) !== "";
  }

  function badgeItems(value) {
    if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean);
    const text = normalizeText(value);
    if (!text) return [];
    if (text.startsWith("[") && text.endsWith("]")) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed.map(normalizeText).filter(Boolean);
      } catch {}
    }
    return text.split(/\s*(?:\||;|\r?\n)\s*/u).map(normalizeText).filter(Boolean);
  }

  function normalizePlanId(value) {
    const numeric = numberValue(value);
    if (!Number.isFinite(numeric) || numeric <= 0 || !Number.isInteger(numeric)) return "";
    return String(numeric);
  }

  function uniqueIds(sourceRows, mapRow) {
    const candidates = (Array.isArray(sourceRows) ? sourceRows : []).map((row) => ({
      row,
      id: normalizePlanId(pick(row, ["No. of Plan", "No of Plan"])),
    }));
    const counts = new Map();
    candidates.forEach(({ id }) => {
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
    });
    return candidates
      .filter(({ id }) => id && counts.get(id) === 1)
      .map(({ row, id }) => mapRow(row, id))
      .filter(Boolean);
  }

  function percentageValue(value, header = "") {
    if (!hasValue(value)) return null;
    const text = latinDigits(normalizeText(value)).replace(/,/g, ".");
    const explicitPercent = text.match(/(\d+(?:\.\d+)?)\s*%/);
    let percentage;
    if (explicitPercent) {
      percentage = Number(explicitPercent[1]);
    } else if (/(?:percent|rate|%)/i.test(normalizeHeader(header))) {
      const parsed = numberValue(text);
      percentage = Number.isFinite(parsed) && parsed > 0 && parsed < 1 ? parsed * 100 : parsed;
    } else {
      return null;
    }
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) return null;
    return Math.round(percentage * 100) / 100;
  }

  function discountFromFormula(formula) {
    const source = latinDigits(normalizeText(formula)).replace(/,/g, ".");
    const deductionPercent = source.match(/\b1\s*-\s*(\d+(?:\.\d+)?)\s*%/i);
    const deductionFraction = source.match(/\b1\s*-\s*(0?\.\d+)(?![\d%])/i);
    const percentMatch = source.match(/(?:\*|×)\s*\(?\s*(\d+(?:\.\d+)?)\s*%\s*\)?/i);
    const fractionMatch = source.match(/(?:\*|×)\s*\(?\s*(0?\.\d+)\s*\)?(?![\d%])/i);
    const directDiscount = deductionPercent
      ? Number(deductionPercent[1])
      : deductionFraction
        ? Number(deductionFraction[1]) * 100
        : NaN;
    if (Number.isFinite(directDiscount) && directDiscount > 0 && directDiscount <= 100) return Math.round(directDiscount * 100) / 100;
    const multiplier = percentMatch
      ? Number(percentMatch[1]) / 100
      : fractionMatch
        ? Number(fractionMatch[1])
        : NaN;
    if (!Number.isFinite(multiplier) || multiplier <= 0 || multiplier >= 1) return null;
    const discount = Math.round((1 - multiplier) * 10000) / 100;
    return discount > 0 ? discount : null;
  }

  function normalizePlans(sheet, categoryId) {
    const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
    const categoryLabel = CATEGORY_LABELS[categoryId] || "";
    return uniqueIds(rows, (row, planId) => {
      const mbs = numberValue(pick(row, ["MBs", "MB", "Megabytes"]));
      const minutes = numberValue(pick(row, ["Minutes", "Minute"]));
      const finalPrice = numberValue(pick(row, ["Final Price", "Final Price (EGP)"]));
      if (!Number.isFinite(mbs) || mbs <= 0 || !Number.isFinite(minutes) || minutes < 0 || !Number.isFinite(finalPrice) || finalPrice <= 0) return null;

      const rawShow = pick(row, ["Show Rate Plan", "Show Plan", "Show", "Visible", "Visibility", "Enabled"]);
      if (rawShow !== undefined && rawShow !== "" && !booleanValue(rawShow, false)) return null;

      const badges = badgeItems(pick(row, ["Badges", "Badge Text", "Plan Badge", "Badge"]));

      const sourceOfferFlag = pick(row, [
        "Discount Eligible", "Eligible For Discount", "Show Offer", "Show Discount", "Discount Enabled", "Has Offer",
      ]);
      const sourceOfferPrice = numberValue(pick(row, ["Offer Price", "Discounted Price", "Offer Final Price"]));
      const percentHeader = ["Discount Percent", "Discount %", "Discount Rate"].find((header) => hasValue(pick(row, [header])));
      const directPercent = percentHeader ? percentageValue(pick(row, [percentHeader]), percentHeader) : null;
      const discountText = normalizeText(pick(row, ["Discount", "Offer", "Special Offer", "Offer Description"]));
      const textPercent = percentageValue(discountText);
      const formula = normalizeText(pick(row, ["Final Price Formula", "_finalPriceFormula", "finalPriceFormula", "formula"]));
      const formulaPercent = discountFromFormula(formula);
      const discountPercent = directPercent ?? textPercent ?? formulaPercent;
      const hasOfferDetails = Number.isFinite(sourceOfferPrice) || discountPercent !== null || Boolean(discountText);
      const offerFlagProvided = hasValue(sourceOfferFlag);
      const discountEligible = offerFlagProvided
        ? booleanValue(sourceOfferFlag, false) && hasOfferDetails
        : hasOfferDetails;

      const categorySource = normalizeText(pick(row, ["Category ID"])) || categoryId;
      return {
        planId,
        name: normalizeText(pick(row, ["Plan Name", "Package Name", "Name", "اسم الباقة"])),
        badge: badges.join(" "),
        badges,
        mbs,
        gb: mbs / 1000,
        minutes,
        finalPrice,
        categoryId: categorySource,
        categoryLabel: CATEGORY_LABELS[categorySource] || normalizeText(pick(row, ["Duration", "Category Label"])) || categoryLabel,
        sourceDiscountEligible: offerFlagProvided ? booleanValue(sourceOfferFlag, false) : undefined,
        sourceOfferPrice,
        sourceDiscountPercent: discountPercent,
        sourceDiscountLabel: discountText,
        sourceFormula: formula,
        offerDetailsAvailable: hasOfferDetails,
        discountEligible,
      };
    });
  }

  function normalizeOffers(sheet) {
    const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
    return uniqueIds(rows, (row, planId) => {
      const finalPrice = numberValue(pick(row, ["Final Price", "Final Price (EGP)"]));
      const showOffer = booleanValue(pick(row, ["Show Offer", "Show Offers"]), false);
      const formula = normalizeText(pick(row, ["Final Price Formula", "_finalPriceFormula", "finalPriceFormula", "formula"]));
      if (!Number.isFinite(finalPrice) || finalPrice <= 0) return null;
      return { planId, finalPrice, showOffer, discountPercent: discountFromFormula(formula) };
    });
  }

  function normalizeSettings(sheet) {
    const result = { ...SETTING_DEFAULTS, announcements: [], paymentMethods: [] };
    const raw = new Map();
    const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
    rows.forEach((row) => {
      const key = normalizeHeader(pick(row, ["Settings", "Setting", "Key", "الإعداد", "المفتاح"]));
      if (!key) return;
      const enableValue = pick(row, ["Enable", "Enabled", "Active"]);
      const enabled = enableValue === undefined ? null : booleanValue(enableValue, false);
      raw.set(key, { value: pick(row, ["Value", "القيمة"]), enabled });
    });

    const entryFor = (aliases) => aliases.map(normalizeHeader).map((key) => raw.get(key)).find(Boolean);
    const enabledSetting = (key, aliases, fallback) => {
      const entry = entryFor([key, ...aliases]);
      if (!entry) return fallback;
      if (entry.enabled === false) return false;
      if (entry.enabled === true) return true;
      if (normalizeText(entry.value) === "--") return true;
      return booleanValue(entry.value, fallback);
    };
    const textSetting = (key, aliases, fallback = "") => {
      const entry = entryFor([key, ...aliases]);
      if (!entry || entry.enabled === false || !hasValue(entry.value) || normalizeText(entry.value) === "--") return fallback;
      return normalizeText(entry.value);
    };

    result.showOffersGlobally = enabledSetting("Show Offers Globally", [], result.showOffersGlobally);
    result.showPlansTo15 = enabledSetting("Show Plans to 15", [], result.showPlansTo15);
    result.showNotes = enabledSetting("Show Notes", [], result.showNotes);
    result.showSearch = enabledSetting("Show Search", [], result.showSearch);
    result.showLastUpdated = enabledSetting("Show Last Updated", [], result.showLastUpdated);
    result.showCopyButton = enabledSetting("Show Copy Button", [], result.showCopyButton);
    result.showShareButton = enabledSetting("Show Share Button", [], result.showShareButton);
    const whatsappToggle = entryFor(["Show WhatsApp"]);
    const whatsappGroupToggle = entryFor(["Show WhatsApp Group"]);
    const telegramToggle = entryFor(["Show Telegram Group", "Show Telegram"]);

    const seconds = numberValue(textSetting("Auto Refresh Seconds", []));
    if (Number.isFinite(seconds) && seconds >= 5 && seconds <= 86400) result.autoRefreshSeconds = seconds;
    result.whatsappNumber = textSetting("WhatsApp Number", []);
    result.whatsappGroupUrl = textSetting("WhatsApp Group URL", []);
    result.telegramGroupUrl = textSetting("Telegram Group URL", []);
    result.showWhatsApp = whatsappToggle
      ? enabledSetting("Show WhatsApp", [], Boolean(result.whatsappNumber))
      : Boolean(result.whatsappNumber);
    result.showWhatsAppGroup = whatsappGroupToggle
      ? enabledSetting("Show WhatsApp Group", [], Boolean(result.whatsappGroupUrl))
      : Boolean(result.whatsappGroupUrl);
    result.showTelegram = telegramToggle
      ? enabledSetting("Show Telegram Group", ["Show Telegram"], Boolean(result.telegramGroupUrl))
      : Boolean(result.telegramGroupUrl);

    rows.forEach((row) => {
      const rawKey = normalizeText(pick(row, ["Settings", "Setting", "Key"]));
      const normalizedKey = normalizeHeader(rawKey);
      const entry = raw.get(normalizedKey);
      const value = normalizeText(pick(row, ["Value", "القيمة"]));
      const announcement = normalizedKey.match(/^announcement_(\d+)$/i);
      if (announcement && entry?.enabled !== false && value && value !== "--") {
        result.announcements.push({ id: rawKey, order: Number(announcement[1]), text: value });
      }
    });
    result.announcements.sort((left, right) => left.order - right.order);
    return result;
  }

  function normalizeAnnouncements(sheet) {
    const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
    return rows.map((row, index) => {
      const text = normalizeText(pick(row, ["Value", "Announcement", "Text", "Ad", "الإعلان", "النص"]));
      if (!text || text === "--") return null;
      const enabled = pick(row, ["Enable", "Enabled", "Active"]);
      if (enabled !== undefined && !booleanValue(enabled, false)) return null;
      const rawOrder = pick(row, ["No.", "No", "Number", "Order", "Announcement No", "ID"]);
      const parsedOrder = numberValue(rawOrder);
      const order = Number.isFinite(parsedOrder) ? parsedOrder : index + 1;
      const id = normalizeText(rawOrder) || String(order);
      return { id, order, text };
    }).filter(Boolean).sort((left, right) => left.order - right.order);
  }

  function canonicalPayment(value) {
    const original = normalizeText(value);
    const key = normalizeHeader(original).replace(/^payment_/, "");
    if (key.includes("vodafone") && key.includes("cash")) return { id: "vodafone_cash", label: "Vodafone Cash" };
    if (key.includes("orange") && key.includes("cash")) return { id: "orange_cash", label: "Orange Cash" };
    if (key.includes("instapay") || key === "ipa") return { id: "instapay", label: "InstaPay" };
    if (key.includes("telda")) return { id: "telda", label: "Telda" };
    if ((key.includes("etisalat") || key.includes("etisalt")) && key.includes("cash")) return { id: "etisalat_cash", label: "Etisalat Cash" };
    if (!key) return null;
    const label = original.replace(/^payment[\s_-]*/i, "").replace(/[_-]+/g, " ").trim() || original;
    const latinSlug = key.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const stableSlug = latinSlug || [...key].map((character) => character.codePointAt(0).toString(16)).join("_");
    return { id: `sheet_${stableSlug}`, label };
  }

  function normalizePaymentMethods(sheet) {
    const methods = new Map();
    (Array.isArray(sheet?.rows) ? sheet.rows : []).forEach((row) => {
      const method = canonicalPayment(pick(row, ["Payment Method", "Method", "طريقة الدفع"]));
      if (!method) return;
      const enabledValue = pick(row, ["Enable", "Enabled", "Active", "Show"]);
      if (!booleanValue(enabledValue, false)) return;
      methods.set(method.id, method);
    });
    return [...methods.values()];
  }

  function normalizeAddOns(sheet) {
    return (Array.isArray(sheet?.rows) ? sheet.rows : []).map((row) => {
      const bundle = normalizeText(pick(row, ["Bundle", "Type", "الباقة"]));
      const quota = numberValue(pick(row, ["Quota", "Quantity", "الكمية"]));
      const price = numberValue(pick(row, ["Price", "السعر"]));
      return bundle && Number.isFinite(quota) && quota > 0 && Number.isFinite(price) && price >= 0
        ? { bundle, quota, price }
        : null;
    }).filter(Boolean);
  }

  function offerFromPlan(plan) {
    if (!plan.offerDetailsAvailable) return undefined;
    return {
      finalPrice: Number.isFinite(plan.sourceOfferPrice) ? plan.sourceOfferPrice : plan.finalPrice,
      discountPercent: plan.sourceDiscountPercent,
      label: plan.sourceDiscountLabel,
    };
  }

  function uniquePlanCopies(plans) {
    const seen = new Set();
    return plans.filter((plan) => {
      const key = [plan.name, plan.mbs, plan.minutes, plan.finalPrice, plan.offer?.finalPrice ?? "", plan.badge].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function normalizePayload(payload) {
    if (!payload || payload.ok !== true || !payload.sheets || typeof payload.sheets !== "object") return { ok: false };
    const sheets = payload.sheets;
    const settings = normalizeSettings(sheets.settings);
    if (sheets.announcements !== undefined) settings.announcements = normalizeAnnouncements(sheets.announcements);
    settings.paymentMethods = normalizePaymentMethods(sheets.paymentMethods || sheets.payments);

    const plans = {
      standard: normalizePlans(sheets.standard, "standard"),
      eom: normalizePlans(sheets.eom, "eom"),
      to15: normalizePlans(sheets.to15, "to15"),
    };
    const offers = settings.showOffersGlobally
      ? new Map(normalizeOffers(sheets.offers).filter((offer) => offer.showOffer).map((offer) => [offer.planId, offer]))
      : new Map();

    plans.standard = plans.standard.map((plan) => {
      if (!settings.showOffersGlobally || plan.sourceDiscountEligible === false) {
        return { ...plan, discountEligible: false, offer: undefined };
      }
      const explicitOffer = plan.sourceDiscountEligible === true ? offerFromPlan(plan) : undefined;
      const sheetOffer = offers.get(plan.planId);
      const offer = explicitOffer || (sheetOffer
        ? { finalPrice: sheetOffer.finalPrice, discountPercent: sheetOffer.discountPercent, label: "" }
        : undefined);
      return offer ? { ...plan, discountEligible: true, offer } : { ...plan, discountEligible: false, offer: undefined };
    });

    for (const categoryId of ["eom", "to15"]) {
      plans[categoryId] = plans[categoryId].map((plan) => {
        const offer = plan.sourceDiscountEligible === false ? undefined : offerFromPlan(plan);
        return offer ? { ...plan, discountEligible: true, offer } : { ...plan, discountEligible: false, offer: undefined };
      });
    }

    if (!Object.values(plans).some((categoryPlans) => categoryPlans.length > 0)) return { ok: false };
    plans.all = uniquePlanCopies([...plans.standard, ...plans.eom, ...plans.to15]);
    return {
      ok: true,
      plans,
      settings,
      addOns: normalizeAddOns(sheets.addons || sheets.addOn),
      fetchedAt: normalizeText(payload.generatedAt),
    };
  }

  function cairoDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
    return { year: values.year, month: values.month, day: values.day };
  }

  function visibleCategories(settings = SETTING_DEFAULTS, date = new Date()) {
    const { year, month, day } = cairoDateParts(date);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const categories = [
      { id: "all", label: CATEGORY_LABELS.all },
      { id: "standard", label: CATEGORY_LABELS.standard },
    ];
    if (day >= 8 && day <= lastDay) categories.push({ id: "eom", label: CATEGORY_LABELS.eom });
    if (settings.showPlansTo15 && (day >= 23 || day <= 15)) categories.push({ id: "to15", label: CATEGORY_LABELS.to15 });
    return categories;
  }

  function formatGigabytes(value) {
    if (!Number.isFinite(value)) return "";
    return String(Number(value.toFixed(2)));
  }

  function whatsappMessage(plan = {}, categoryId = plan.categoryId) {
    const gigabytes = formatGigabytes(numberValue(plan.gb));
    const minutesValue = numberValue(plan.minutes);
    const minutes = Number.isFinite(minutesValue) ? new Intl.NumberFormat("en-US").format(minutesValue) : "";
    const priceValue = numberValue(plan.currentPrice ?? plan.finalPrice);
    const price = Number.isFinite(priceValue) ? new Intl.NumberFormat("en-US").format(priceValue) : "";
    const specification = [gigabytes ? `${gigabytes} جيجا` : "", minutes ? `${minutes} دقيقة` : ""].filter(Boolean).join(" و ");
    const duration = categoryId === "to15"
      ? "حتى يوم 15"
      : categoryId === "eom"
        ? "حتى نهاية الشهر"
        : "لمدة 30 يوم من يوم 1 أو 16";
    return `السلام عليكم عايز اشترك في باقة ${specification}${duration ? ` ${duration}` : ""}${price ? ` بسعر ${price} ج` : ""}`;
  }

  root.WEDataCore = Object.freeze({
    CATEGORY_LABELS,
    DEFAULT_REFRESH_SECONDS,
    SETTING_DEFAULTS,
    booleanValue,
    cairoDateParts,
    discountFromFormula,
    formatGigabytes,
    normalizeHeader,
    normalizeAnnouncements,
    normalizeSearchText,
    normalizePayload,
    normalizePaymentMethods,
    normalizeSettings,
    numberValue,
    percentageValue,
    pick,
    visibleCategories,
    whatsappMessage,
  });
  if (typeof module !== "undefined" && module.exports) module.exports = root.WEDataCore;
})(typeof globalThis !== "undefined" ? globalThis : this);

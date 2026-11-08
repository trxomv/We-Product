/**
 * Read-only JSON/JSONP bridge for the WE Offers public website.
 * This project is intended to run as its owner with public access. It reads
 * only allowlisted website-facing fields and never writes to the spreadsheet.
 */
const SPREADSHEET_ID = "1njuAIxAfHpQXqNazapKEca-NQ_Czd-yj5GzRSpguVuA";
const CACHE_SECONDS = 10;
const CACHE_KEY = "weoffers_public_payload_v8_custom_pricing";

const SHEET_NAMES = Object.freeze({
  standard: "Rate Plans-Website",
  eom: "Rate Plans to EOM-Website",
  to15: "Rate Plans to 15-Website",
  offers: "Rate Plans_OFFER-Website",
  settings: "Website Settings",
  announcements: "Announcements",
  paymentMethods: "Payment Methods",
  addons: "Add-on",
  customPricing: "Custom Pricing",
});

const OFFER_FIELDS = Object.freeze([
  "Discount Eligible", "Eligible For Discount", "Show Offer", "Show Discount", "Discount Enabled", "Has Offer",
  "Offer Price", "Discounted Price", "Offer Final Price", "Discount Percent", "Discount %", "Discount Rate",
  "Discount", "Offer", "Special Offer", "Offer Description",
]);

function doGet(event) {
  const callback = safeCallback_(event && event.parameter ? event.parameter.callback : "");
  try {
    return output_(cachedPayload_(), callback);
  } catch (error) {
    console.error("WE Offers sheet read failed", error);
    return output_({ ok: false, error: "تعذر قراءة مصدر الباقات" }, callback);
  }
}

function cachedPayload_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (_) { cache.remove(CACHE_KEY); }
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = {
    standard: readTable_(spreadsheet, SHEET_NAMES.standard, "plans", "standard"),
    eom: readTable_(spreadsheet, SHEET_NAMES.eom, "plans", "eom"),
    to15: readTable_(spreadsheet, SHEET_NAMES.to15, "plans", "to15"),
    offers: readTable_(spreadsheet, SHEET_NAMES.offers, "offers"),
    settings: readTable_(spreadsheet, SHEET_NAMES.settings, "settings"),
    announcements: readTable_(spreadsheet, SHEET_NAMES.announcements, "announcements"),
    paymentMethods: readTable_(spreadsheet, SHEET_NAMES.paymentMethods, "paymentMethods"),
    addons: readTable_(spreadsheet, SHEET_NAMES.addons, "addons"),
    customPricing: readTable_(spreadsheet, SHEET_NAMES.customPricing, "customPricing"),
  };
  decorateStandardOffers_(sheets);
  const payload = { ok: true, generatedAt: new Date().toISOString(), sheets: sheets };
  try { cache.put(CACHE_KEY, JSON.stringify(payload), CACHE_SECONDS); } catch (_) {}
  return payload;
}

function readTable_(spreadsheet, sheetName, kind, categoryId) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error("Missing required sheet: " + sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (!values.length || !values[0].length) throw new Error("Missing header row: " + sheetName);

  const sourceHeaders = values[0].map(function (header) { return String(header == null ? "" : header).trim(); });
  const formulaRows = kind === "offers" || (kind === "plans" && categoryId !== "standard") ? range.getFormulas() : null;
  const definitions = definitionsFor_(kind);
  const selected = [];
  const headerCounts = countHeaders_(sourceHeaders);

  definitions.forEach(function (definition) {
    const index = findUniqueColumn_(sourceHeaders, headerCounts, definition.aliases);
    if (index < 0 && definition.required) throw new Error("Missing or duplicate required header in " + sheetName + ": " + definition.aliases[0]);
    if (index >= 0) selected.push({ key: definition.key, index: index, header: sourceHeaders[index] });
  });

  const rows = [];
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const sourceRow = values[rowIndex];
    const record = {};
    let hasContent = false;
    selected.forEach(function (column) {
      const value = sourceRow[column.index];
      record[column.header] = value;
      if (value !== "" && value !== null && value !== undefined) hasContent = true;
    });
    if (!hasContent) continue;

    if (kind === "plans" && categoryId) {
      record["Category ID"] = categoryId;
      record["Category"] = categoryLabel_(categoryId);
      record["Duration"] = categoryLabel_(categoryId);
      if (categoryId !== "standard" && formulaRows && selectedPriceIndex_(selected) >= 0) {
        const priceIndex = selectedPriceIndex_(selected);
        const formula = String(formulaRows[rowIndex][priceIndex] || "");
        const formulaDiscount = discountFromFormula_(formula);
        if (rowHasOfferData_(record) || formulaDiscount !== null) {
          if (formulaDiscount !== null) record["Discount Percent"] = formulaDiscount;
        }
      }
    }
    if (kind === "offers") {
      const priceIndex = selectedPriceIndex_(selected);
      const formula = priceIndex >= 0 && formulaRows ? String(formulaRows[rowIndex][priceIndex] || "") : "";
      const formulaDiscount = discountFromFormula_(formula);
      if (formulaDiscount !== null) record["Discount Percent"] = formulaDiscount;
    }
    if (kind === "announcements") {
      const enabled = recordValue_(record, ["Enable", "Enabled", "Active"]);
      const text = recordValue_(record, ["Value", "Announcement", "Text", "Ad"]);
      if (!booleanValue_(enabled, false) || text == null || String(text).trim() === "" || String(text).trim() === "--") continue;
    }
    rows.push(record);
  }
  return { headers: selected.map(function (column) { return column.header; }), rows: rows };
}

function selectedPriceIndex_(selected) {
  const column = selected.find(function (entry) { return entry.key === "finalPrice"; });
  return column ? column.index : -1;
}

function categoryLabel_(categoryId) {
  return {
    standard: "باقات من يوم 1 أو 16",
    eom: "باقات حتى نهاية الشهر",
    to15: "باقات حتى يوم 15",
  }[categoryId] || categoryId;
}

function rowHasOfferData_(record) {
  const flag = recordValue_(record, [
    "Discount Eligible", "Eligible For Discount", "Show Offer", "Show Discount", "Discount Enabled", "Has Offer",
  ]);
  if (flag !== undefined && String(flag).trim() !== "") return booleanValue_(flag, false);
  return OFFER_FIELDS.some(function (key) {
    const value = recordValue_(record, [key]);
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

function decorateStandardOffers_(sheets) {
  const settings = Object.create(null);
  (sheets.settings.rows || []).forEach(function (row) {
    const key = String(recordValue_(row, ["Settings", "Setting", "Key"]) || "").trim();
    if (!key) return;
    const enableValue = recordValue_(row, ["Enable", "Enabled", "Active"]);
    settings[normalizeHeader_(key)] = {
      value: recordValue_(row, ["Value"]),
      enabled: enableValue === undefined ? null : booleanValue_(enableValue, false),
    };
  });

  const offers = Object.create(null);
  (sheets.offers.rows || []).forEach(function (row) {
    const id = normalizePlanId_(recordValue_(row, ["No. of Plan", "No of Plan"]));
    if (!id || !booleanValue_(recordValue_(row, ["Show Offer", "Show Offers"]), false)) return;
    offers[id] = row;
  });

  const global = settings[normalizeHeader_("Show Offers Globally")];
  const globalEnabled = global
    ? (global.enabled === null ? booleanValue_(global.value, false) : global.enabled)
    : false;

  sheets.standard.rows = (sheets.standard.rows || []).map(function (row) {
    const id = normalizePlanId_(recordValue_(row, ["No. of Plan", "No of Plan"]));
    const offer = globalEnabled ? offers[id] : null;
    const rawDiscount = offer ? recordValue_(offer, ["Discount Percent", "Discount %"]) : null;
    const discount = rawDiscount !== null && rawDiscount !== undefined && String(rawDiscount).trim() !== ""
      ? Number.parseFloat(String(rawDiscount).replace("%", ""))
      : null;
    row["Discount Eligible"] = Boolean(offer);
    row["Offer Price"] = offer ? recordValue_(offer, ["Final Price", "Final Price (EGP)"]) : "";
    row["Discount Percent"] = discount == null ? "" : discount;
    row["Show Offer"] = Boolean(offer);
    return row;
  });
}

function definitionsFor_(kind) {
  if (kind === "plans") return [
    { key: "planId", aliases: ["No. of Plan", "No of Plan"], required: true },
    { key: "name", aliases: ["Plan Name", "Package Name", "Name"], required: false },
    { key: "mbs", aliases: ["MBs", "MB", "Megabytes"], required: true },
    { key: "minutes", aliases: ["Minutes", "Minute"], required: true },
    { key: "mainPrice", aliases: ["Main Price"], required: false },
    { key: "increase", aliases: ["Increase"], required: false },
    { key: "finalPrice", aliases: ["Final Price", "Final Price (EGP)"], required: true },
    { key: "badge", aliases: ["Badge", "Plan Badge"], required: false },
    { key: "show", aliases: ["Show Rate Plan", "Show Plan", "Show", "Visible", "Visibility", "Enabled"], required: false },
    { key: "discountEligible", aliases: ["Discount Eligible"], required: false },
    { key: "eligibleForDiscount", aliases: ["Eligible For Discount"], required: false },
    { key: "showOffer", aliases: ["Show Offer"], required: false },
    { key: "showDiscount", aliases: ["Show Discount"], required: false },
    { key: "discountEnabled", aliases: ["Discount Enabled"], required: false },
    { key: "hasOffer", aliases: ["Has Offer"], required: false },
    { key: "offerPrice", aliases: ["Offer Price"], required: false },
    { key: "discountedPrice", aliases: ["Discounted Price"], required: false },
    { key: "offerFinalPrice", aliases: ["Offer Final Price"], required: false },
    { key: "discountPercent", aliases: ["Discount Percent", "Discount %"], required: false },
    { key: "discountRate", aliases: ["Discount Rate"], required: false },
    { key: "discountText", aliases: ["Discount"], required: false },
    { key: "offerText", aliases: ["Offer"], required: false },
    { key: "specialOffer", aliases: ["Special Offer"], required: false },
    { key: "offerDescription", aliases: ["Offer Description"], required: false },
  ];
  if (kind === "offers") return [
    { key: "planId", aliases: ["No. of Plan", "No of Plan"], required: true },
    { key: "mbs", aliases: ["MBs", "MB", "Megabytes"], required: false },
    { key: "minutes", aliases: ["Minutes", "Minute"], required: false },
    { key: "mainPrice", aliases: ["Main Price"], required: false },
    { key: "increase", aliases: ["Increase"], required: false },
    { key: "finalPrice", aliases: ["Final Price", "Final Price (EGP)"], required: true },
    { key: "showOffer", aliases: ["Show Offer", "Show Offers"], required: true },
    { key: "discountPercent", aliases: ["Discount Percent", "Discount %"], required: false },
  ];
  if (kind === "customPricing") return [
    { key: "ruleType", aliases: ["Type"], required: true },
    { key: "gbFrom", aliases: ["GB From"], required: true },
    { key: "gbTo", aliases: ["GB To"], required: true },
    { key: "minutesFrom", aliases: ["Minutes From"], required: true },
    { key: "minutesTo", aliases: ["Minutes To"], required: true },
    { key: "gbPrice", aliases: ["GB Price"], required: true },
    { key: "minutePrice", aliases: ["Minute Price"], required: true },
    { key: "enabled", aliases: ["Enabled", "Enable", "Active"], required: true },
  ];
  if (kind === "settings") return [
    { key: "setting", aliases: ["Settings", "Setting", "Key", "الإعداد", "المفتاح"], required: true },
    { key: "settingValue", aliases: ["Value", "القيمة"], required: false },
    { key: "settingEnable", aliases: ["Enable", "Enabled", "Active"], required: false },
  ];
  if (kind === "announcements") return [
    { key: "announcementNo", aliases: ["No.", "No", "Number", "Order"], required: true },
    { key: "announcementValue", aliases: ["Value", "Announcement", "Text", "Ad"], required: true },
    { key: "announcementEnable", aliases: ["Enable", "Enabled", "Active"], required: true },
  ];
  if (kind === "paymentMethods") return [
    { key: "paymentMethod", aliases: ["Payment Method", "Method", "طريقة الدفع"], required: true },
    { key: "settingEnable", aliases: ["Enable", "Enabled", "Active", "Show"], required: true },
  ];
  if (kind === "addons") return [
    { key: "bundle", aliases: ["Bundle", "Type", "الباقة"], required: true },
    { key: "quota", aliases: ["Quota", "Quantity", "الكمية"], required: true },
    { key: "price", aliases: ["Price", "السعر"], required: true },
  ];
  throw new Error("Unsupported sheet type: " + kind);
}

function recordValue_(record, aliases) {
  const wanted = new Set(aliases.map(normalizeHeader_));
  const keys = Object.keys(record || {});
  for (let index = 0; index < keys.length; index += 1) {
    if (wanted.has(normalizeHeader_(keys[index]))) return record[keys[index]];
  }
  return undefined;
}

function normalizePlanId_(value) {
  const text = String(value == null ? "" : value).trim();
  if (!text || !/^\d+(?:\.0+)?$/.test(text)) return "";
  return String(Number(text));
}

function booleanValue_(value, fallback) {
  if (value === true || value === false) return value;
  const normalized = String(value == null ? "" : value).trim().toLowerCase();
  if (["true", "1", "yes", "y", "نعم", "مفعل", "مفعّل", "نشط", "نشطة"].indexOf(normalized) >= 0) return true;
  if (["false", "0", "no", "n", "لا", "معطل", "معطّل", "غير مفعل", "غير مفعّل"].indexOf(normalized) >= 0) return false;
  return fallback === undefined ? false : fallback;
}

function discountFromFormula_(formula) {
  const source = String(formula == null ? "" : formula).replace(/[٠-٩]/g, function (digit) { return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)); }).replace(/,/g, ".");
  const deductionPercent = source.match(/\b1\s*-\s*(\d+(?:\.\d+)?)\s*%/i);
  const deductionFraction = source.match(/\b1\s*-\s*(0?\.\d+)(?![\d%])/i);
  const percent = source.match(/(?:\*|×)\s*\(?\s*(\d+(?:\.\d+)?)\s*%\s*\)?/i);
  const fraction = source.match(/(?:\*|×)\s*\(?\s*(0?\.\d+)\s*\)?(?![\d%])/i);
  const subtraction = deductionPercent ? Number(deductionPercent[1]) : deductionFraction ? Number(deductionFraction[1]) * 100 : NaN;
  if (isFinite(subtraction) && subtraction > 0 && subtraction <= 100) return Math.round(subtraction * 100) / 100;
  const multiplier = percent ? Number(percent[1]) / 100 : fraction ? Number(fraction[1]) : NaN;
  if (!isFinite(multiplier) || multiplier <= 0 || multiplier >= 1) return null;
  const discount = Math.round((1 - multiplier) * 10000) / 100;
  return discount > 0 ? discount : null;
}

function normalizeHeader_(value) {
  return String(value == null ? "" : value).normalize("NFKC").trim().toLowerCase().replace(/[.]/g, "").replace(/[\s-]+/g, "_");
}

function countHeaders_(headers) {
  const counts = Object.create(null);
  headers.forEach(function (header) {
    const key = normalizeHeader_(header);
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function findUniqueColumn_(headers, counts, aliases) {
  const wanted = new Set(aliases.map(normalizeHeader_));
  const matches = [];
  headers.forEach(function (header, index) {
    const key = normalizeHeader_(header);
    if (wanted.has(key) && counts[key] === 1) matches.push(index);
  });
  return matches.length === 1 ? matches[0] : -1;
}

function safeCallback_(candidate) {
  const value = String(candidate || "");
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value) ? value : "";
}

function output_(payload, callback) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  const body = callback ? callback + "(" + json + ");" : json;
  return ContentService.createTextOutput(body).setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

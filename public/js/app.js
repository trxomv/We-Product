import "../site-config.js";
import "./data/data-core.js";
import * as customizerCore from "./data/customizer-core.js";
import { createAddonRow } from "./components/addon-row.js";
import { paymentLogoCandidates, paymentLogoInitials } from "./components/payment-logo.js";
import { make } from "./utils/dom.js";
import { formatNumber } from "./utils/format.js";

(() => {
  "use strict";

  const core = window.WEDataCore;
  const config = window.WE_SITE_CONFIG ?? {};
  const CACHE_KEY = "weoffers-live-cache-v6";
  const PACKAGE_ACCENTS = Object.freeze({
    7: "#8b3fd0",
    10: "#a34fed",
    15: "#ea3084",
    17: "#168fe2",
    20: "#31d782",
    30: "#ff951f",
    40: "#10c9d0",
    50: "#df3189",
    55: "#f7cb25",
    60: "#1d86d6",
    100: "#a34fed",
  });
  const PAYMENT_ASSETS = Object.freeze({
    vodafone_cash: { label: "Vodafone Cash", src: "assets/payment-methods/vodafone-cash.webp" },
    orange_cash: { label: "Orange Cash", src: "assets/payment-methods/orange-cash.webp" },
    instapay: { label: "InstaPay", src: "assets/payment-methods/instapay.webp" },
    telda: { label: "Telda", src: "assets/payment-methods/telda.webp" },
  });
  const elements = {
    grid: document.getElementById("offer-grid"),
    filterSection: document.getElementById("package-filters"),
    tabs: document.getElementById("category-tabs"),
    searchWrap: document.getElementById("search-wrap"),
    searchInput: document.getElementById("search-input"),
    status: document.getElementById("offers-status"),
    empty: document.getElementById("offers-empty"),
    count: document.getElementById("offer-count"),
    range: document.getElementById("offer-range"),
    title: document.getElementById("offers-title"),
    lastUpdated: document.getElementById("last-updated"),
    retryButton: document.getElementById("retry-button"),
    finalNote: document.getElementById("final-note"),
    contactBar: document.getElementById("contact-bar"),
    contactPhone: document.getElementById("contact-phone"),
    contactPhoneText: document.getElementById("contact-phone-text"),
    groupLink: document.getElementById("whatsapp-group-link"),
    telegramLink: document.getElementById("telegram-group-link"),
    headerWhatsapp: document.getElementById("header-whatsapp"),
    heroWhatsapp: document.getElementById("hero-whatsapp"),
    footerWhatsapp: document.getElementById("footer-whatsapp"),
    announcementBar: document.getElementById("announcement-bar"),
    announcementText: document.getElementById("announcement-text"),
    announcementDots: document.getElementById("announcement-dots"),
    extraBar: document.getElementById("extra-data-bar"),
    extraItems: document.getElementById("extra-data-items"),
    paymentSection: document.getElementById("payment-methods"),
    paymentGrid: document.getElementById("payment-method-grid"),
    customizer: document.getElementById("customizer-panel"),
    customBilling: document.getElementById("custom-billing-options"),
    customAdvanceOptions: document.getElementById("custom-advance-options"),
    customStartOptions: document.getElementById("custom-start-options"),
    customStartDays: document.getElementById("custom-start-days"),
    customDurationMode: document.getElementById("custom-duration-mode"),
    customDaysControl: document.getElementById("custom-days-control"),
    customBookingNotice: document.getElementById("custom-booking-notice"),
    customGbRange: document.getElementById("custom-gb-range"),
    customGbNumber: document.getElementById("custom-gb-number"),
    customMinutesRange: document.getElementById("custom-minutes-range"),
    customMinutesNumber: document.getElementById("custom-minutes-number"),
    customDaysRange: document.getElementById("custom-days-range"),
    customDaysNumber: document.getElementById("custom-days-number"),
    customDaysMidpoint: document.getElementById("custom-days-midpoint"),
    customDaysMaximum: document.getElementById("custom-days-maximum"),
    customDurationTotal: document.getElementById("custom-duration-total"),
    customStartDate: document.getElementById("custom-start-date"),
    customEndDate: document.getElementById("custom-end-date"),
    customValidityPeriod: document.getElementById("custom-validity-period"),
    customSummaryGb: document.getElementById("custom-summary-gb"),
    customSummaryMinutes: document.getElementById("custom-summary-minutes"),
    customSummaryDays: document.getElementById("custom-summary-days"),
    customPrice: document.getElementById("custom-final-price"),
    customPriceSource: document.getElementById("custom-price-source"),
    customSubscribe: document.getElementById("custom-subscribe"),
    customStatus: document.getElementById("customizer-status"),
  };

  let currentData = null;
  let selectedCategory = new URLSearchParams(window.location.search).get("customize") === "1" ? "custom" : "all";
  let searchText = "";
  let refreshTimer = null;
  let loadingTimer = null;
  let announcementTimer = null;
  let announcementIndex = 0;
  let loading = false;
  let stale = false;
  let capAdjustmentMessage = "";
  let minutesEditing = false;
  const customState = { billing: "current", futureMode: "custom", startDay: 1, gb: 10, minutes: 500, days: 30 };

  function safeEndpoint(value) {
    if (!value || String(value).includes("__SHEETS_WEB_APP_URL__")) return "";
    try {
      const url = new URL(String(value).trim(), document.baseURI);
      if (url.username || url.password || url.hash) return "";
      if (url.origin === window.location.origin && url.pathname === "/preview-api.js") return url.href;
      if (url.protocol === "https:" && url.hostname.toLowerCase() === "script.google.com" && /^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname)) return url.href;
      return "";
    } catch {
      return "";
    }
  }

  function jsonp(url, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const callbackName = `__weData_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const separator = url.includes("?") ? "&" : "?";
      let settled = false;
      const timer = window.setTimeout(() => finish(new Error("timeout")), timeoutMs);

      function cleanup() {
        window.clearTimeout(timer);
        script.remove();
        try { delete window[callbackName]; } catch { window[callbackName] = undefined; }
      }
      function finish(error, value) {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) reject(error);
        else resolve(value);
      }

      window[callbackName] = (value) => finish(null, value);
      script.async = true;
      script.onerror = () => finish(new Error("source unavailable"));
      script.src = `${url}${separator}callback=${encodeURIComponent(callbackName)}&_=${Date.now()}`;
      document.head.append(script);
    });
  }

  function validWhatsAppNumber(value) {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (/^01\d{9}$/.test(digits)) return `2${digits}`;
    return /^\d{10,15}$/.test(digits) ? digits : "";
  }

  function displayWhatsAppNumber(value) {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (/^20\d{10}$/.test(digits)) return `0${digits.slice(2)}`;
    return digits;
  }

  function trustedGroupLink(value) {
    try {
      const url = new URL(String(value ?? "").trim());
      return url.protocol === "https:" && url.hostname.toLowerCase() === "chat.whatsapp.com" ? url.href : "";
    } catch {
      return "";
    }
  }

  function trustedTelegramLink(value) {
    try {
      const url = new URL(String(value ?? "").trim());
      return url.protocol === "https:" && url.hostname.toLowerCase() === "t.me" && url.pathname.length > 1 ? url.href : "";
    } catch {
      return "";
    }
  }

  function baseWhatsAppUrl(number, message = "") {
    if (!number) return "";
    const base = `https://wa.me/${number}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  function sourceSettings() {
    return currentData?.settings ?? core.SETTING_DEFAULTS;
  }

  function setStatus(message, state = "info") {
    if (!elements.status) return;
    elements.status.textContent = message;
    elements.status.dataset.state = state;
    if (elements.retryButton) elements.retryButton.hidden = !["slow", "error"].includes(state);
    elements.status.setAttribute("aria-busy", String(loading));
    if (elements.grid) elements.grid.setAttribute("aria-busy", String(loading));
  }

  function readCache() {
    try {
      const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "null");
      const normalized = core.normalizePayload(cached?.payload);
      return normalized.ok ? normalized : null;
    } catch {
      return null;
    }
  }

  function writeCache(payload) {
    try { window.localStorage.setItem(CACHE_KEY, JSON.stringify({ payload })); } catch {}
  }

  function formatUpdatedAt(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "Africa/Cairo" }).format(date);
  }

  function renderAnnouncements() {
    const announcements = sourceSettings().announcements ?? [];
    if (!elements.announcementBar || !elements.announcementText) return;
    window.clearInterval(announcementTimer);
    announcementTimer = null;
    if (!announcements.length) {
      elements.announcementBar.hidden = true;
      return;
    }
    announcementIndex %= announcements.length;
    const showCurrent = () => {
      const item = announcements[announcementIndex % announcements.length];
      elements.announcementText.textContent = item.text;
      if (elements.announcementDots) {
        elements.announcementDots.textContent = announcements.length > 1
          ? `${formatNumber((announcementIndex % announcements.length) + 1)} / ${formatNumber(announcements.length)}`
          : "";
      }
      announcementIndex += 1;
    };
    elements.announcementBar.hidden = false;
    showCurrent();
    if (announcements.length > 1) announcementTimer = window.setInterval(showCurrent, 5000);
  }

  function renderAddOns(addOns = []) {
    if (!elements.extraBar || !elements.extraItems) return;
    elements.extraItems.replaceChildren();
    addOns.forEach((item) => elements.extraItems.append(createAddonRow(item, { formatNumber })));
    elements.extraBar.hidden = addOns.length === 0;
  }

  function paymentMethodMark(label) {
    const mark = make("span", "payment-method-mark", paymentLogoInitials(label));
    mark.setAttribute("aria-hidden", "true");
    return mark;
  }

  function renderPaymentMethods() {
    if (!elements.paymentSection || !elements.paymentGrid) return;
    const methods = sourceSettings().paymentMethods ?? [];
    elements.paymentGrid.replaceChildren();
    methods.forEach((method) => {
      const candidates = paymentLogoCandidates(method, PAYMENT_ASSETS);
      const card = make("div", "payment-method-card");
      const label = make("strong", "", method.label);
      if (candidates.length) {
        const image = make("img", "payment-method-logo");
        image.classList.add(`payment-logo-${method.id}`);
        image.alt = method.label;
        image.loading = "lazy";
        image.decoding = "async";
        let candidateIndex = 0;
        const useNextCandidate = () => {
          if (candidateIndex < candidates.length) {
            image.src = candidates[candidateIndex++];
            return;
          }
          image.replaceWith(paymentMethodMark(method.label));
          image.removeEventListener("error", useNextCandidate);
        };
        image.addEventListener("error", useNextCandidate);
        card.append(image, label);
        useNextCandidate();
      } else {
        card.append(paymentMethodMark(method.label), label);
      }
      elements.paymentGrid.append(card);
    });
    elements.paymentSection.hidden = elements.paymentGrid.childElementCount === 0;
  }

  function setCustomStatus(message, state = "info") {
    if (!elements.customStatus) return;
    elements.customStatus.textContent = message;
    elements.customStatus.dataset.state = state;
  }

  function normalizeMinuteDigits(value) {
    return String(value ?? "")
      .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
      .replace(/[٬,\s]/g, "")
      .trim();
  }

  function commitMinutesInput() {
    if (!minutesEditing || !elements.customMinutesNumber) return;
    const normalized = normalizeMinuteDigits(elements.customMinutesNumber.value);
    const parsed = normalized === "" ? 0 : Number(normalized);
    const value = Number.isFinite(parsed) ? Math.min(3500, Math.max(0, Math.trunc(parsed))) : customState.minutes;
    minutesEditing = false;
    customNumber("minutes", value);
  }

  function selectCustomButtons(selector, attribute, value) {
    document.querySelectorAll(selector).forEach((button) => {
      const selected = button.getAttribute(attribute) === String(value);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function customNumber(name, raw, { preserveControl = null } = {}) {
    const fullMonth = customState.billing === "next" && customState.futureMode === "full";
    const limits = {
      gb: { min: 0, max: customizerCore.maximumCustomGigabytes(customState.days, { fullMonth }), step: 1 },
      minutes: { min: 0, max: 3500, step: 1 },
      days: { min: 1, max: Number(elements.customDaysNumber?.max) || customizerCore.CUSTOM_DURATION_MAX_DAYS, step: 1 },
    }[name];
    if (!limits) return;
    if (preserveControl && String(raw).trim() === "") return;
    const parsed = Number(raw);
    const value = Number.isFinite(parsed) ? parsed : limits.min;
    if (name === "gb" && value > limits.max && limits.max === customizerCore.SHORT_DURATION_GIGABYTE_MAX) {
      capAdjustmentMessage = "الحد الأقصى للإنترنت عند اختيار مدة من يوم إلى 7 أيام هو 20 جيجا.";
    } else if (name === "gb") {
      capAdjustmentMessage = "";
    }
    customState[name] = Math.min(limits.max, Math.max(limits.min, Math.round(value / limits.step) * limits.step));
    renderCustomizer({ preserveControl: customState[name] === value ? preserveControl : null });
  }

  function renderCustomizer({ preserveControl = null } = {}) {
    if (!elements.customizer) return;
    if (!preserveControl && minutesEditing) preserveControl = elements.customMinutesNumber;
    if (!currentData) {
      setCustomStatus("جارٍ تحميل بيانات الباقات والأسعار…", "info");
      if (elements.customSubscribe) elements.customSubscribe.setAttribute("aria-disabled", "true");
      return;
    }
    const settings = currentData.settings;
    const allowDay1 = settings.customRatePlansFrom1 === true;
    const allowDay16 = settings.customRatePlansFrom16 === true;
    const allowedStarts = [allowDay1 ? 1 : null, allowDay16 ? 16 : null].filter(Boolean);
    if (customState.billing === "next" && allowedStarts.length && !allowedStarts.includes(customState.startDay)) customState.startDay = allowedStarts[0];

    elements.customAdvanceOptions.hidden = customState.billing !== "next" || allowedStarts.length === 0;
    elements.customStartOptions.hidden = customState.billing !== "next" || allowedStarts.length === 0;
    elements.customDurationMode.hidden = customState.billing !== "next" || allowedStarts.length === 0;
    elements.customBookingNotice.hidden = customState.billing !== "next" || allowedStarts.length > 0;
    if (elements.customBookingNotice.hidden === false) {
      elements.customBookingNotice.textContent = "الحجز المسبق غير متاح حاليًا؛ إعدادا Custom Rate Plans From 1 وCustom Rate Plans From 16 غير مفعّلين في Website Settings.";
    }
    selectCustomButtons("[data-billing]", "data-billing", customState.billing);
    selectCustomButtons("[data-future-mode]", "data-future-mode", customState.futureMode);
    if (elements.customStartDays) {
      elements.customStartDays.replaceChildren(...allowedStarts.map((day) => {
        const button = make("button", `custom-choice${customState.startDay === day ? " is-selected" : ""}`, `يوم ${day}`);
        button.type = "button";
        button.dataset.startDay = String(day);
        button.setAttribute("aria-pressed", String(customState.startDay === day));
        button.addEventListener("click", () => {
          customState.startDay = day;
          renderCustomizer();
        });
        return button;
      }));
    }

    const futureFull = customState.billing === "next" && customState.futureMode === "full" && allowedStarts.length > 0;
    if (elements.customDaysControl) elements.customDaysControl.hidden = futureFull || (customState.billing === "next" && !allowedStarts.length);
    const schedule = customizerCore.resolveSchedule({
      billing: customState.billing,
      futureMode: customState.futureMode,
      startDay: customState.startDay,
      days: customState.days,
      allowDay1,
      allowDay16,
    });
    if (schedule.valid && !schedule.fullMonth && customState.days !== schedule.days) customState.days = schedule.days;
    const gbMax = customizerCore.maximumCustomGigabytes(schedule.days, { fullMonth: schedule.fullMonth });
    if (schedule.valid && customState.gb > gbMax) {
      customState.gb = gbMax;
      capAdjustmentMessage = "تم ضبط كمية الإنترنت إلى 20 جيجا؛ الحد الأقصى عند مدة من يوم إلى 7 أيام هو 20 جيجا.";
      preserveControl = null;
    } else if (gbMax > customizerCore.SHORT_DURATION_GIGABYTE_MAX) {
      capAdjustmentMessage = "";
    }

    const durationMax = Math.max(1, schedule.maxDays || 1);
    const daysControls = [[elements.customGbRange, customState.gb], [elements.customGbNumber, customState.gb], [elements.customMinutesRange, customState.minutes], [elements.customMinutesNumber, customState.minutes], [elements.customDaysRange, customState.days], [elements.customDaysNumber, customState.days]];
    daysControls.forEach(([control, value]) => { if (control && control !== preserveControl) control.value = String(value); });
    if (elements.customGbRange) elements.customGbRange.max = String(gbMax);
    if (elements.customGbNumber) elements.customGbNumber.max = String(gbMax);
    const gbMidpointLabel = elements.customizer.querySelector('[data-custom-control="gb"] .custom-range-scale span:nth-child(2)');
    const gbMaximumLabel = elements.customizer.querySelector('[data-custom-control="gb"] .custom-range-scale span:last-child');
    if (gbMaximumLabel) gbMaximumLabel.textContent = `${gbMax} جيجا`;
    if (gbMidpointLabel) gbMidpointLabel.textContent = `${Math.round(gbMax / 2)} جيجا`;
    if (elements.customDaysRange) elements.customDaysRange.max = String(durationMax);
    if (elements.customDaysNumber) elements.customDaysNumber.max = String(durationMax);
    if (elements.customDaysMidpoint) elements.customDaysMidpoint.textContent = `${Math.max(1, Math.ceil(durationMax / 2))} يوم`;
    if (elements.customDaysMaximum) elements.customDaysMaximum.textContent = `${durationMax} يوم`;

    if (elements.customSummaryGb) elements.customSummaryGb.textContent = `${formatNumber(customState.gb)} جيجا`;
    if (elements.customSummaryMinutes) elements.customSummaryMinutes.textContent = `${formatNumber(customState.minutes)} دقيقة`;
    if (elements.customSummaryDays) elements.customSummaryDays.textContent = schedule.valid
      ? (schedule.fullMonth ? "شهر كامل" : `${formatNumber(schedule.days)} يوم`)
      : "غير متاح";
    if (elements.customDurationTotal) elements.customDurationTotal.textContent = schedule.valid ? `${formatNumber(schedule.days)} يوم` : "غير متاح";
    if (elements.customStartDate) elements.customStartDate.textContent = schedule.valid ? customizerCore.formatDate(schedule.start) : "—";
    if (elements.customEndDate) elements.customEndDate.textContent = schedule.valid ? customizerCore.formatDate(schedule.end) : "—";
    if (elements.customValidityPeriod) elements.customValidityPeriod.textContent = schedule.valid
      ? schedule.description
      : "لا تتوفر فترة صلاحية حاليًا.";

    const result = schedule.valid ? customizerCore.calculateCustomPrice({
      data: currentData,
      gb: customState.gb,
      minutes: customState.minutes,
      days: schedule.days,
      pricingMonthDays: schedule.pricingMonthDays,
      fullMonth: schedule.fullMonth,
    }) : { ok: false, reason: "booking-disabled" };
    const price = result.ok ? result.finalPrice : NaN;
    const sourceNames = { offer: "عرض نشط", standard: "سعر الباقة الأساسية", custom: "تسعير مخصص" };
    if (elements.customPrice) elements.customPrice.textContent = Number.isFinite(price) ? formatNumber(price) : "—";
    if (elements.customPriceSource) elements.customPriceSource.textContent = result.ok
  ? (sourceNames[result.source] ?? "السعر المعتمد من الشيت")
  : "لا يوجد سعر مؤكد لهذه الاختيارات.";

    const phone = validWhatsAppNumber(settings.whatsappNumber);
    const message = result.ok ? customizerCore.createWhatsAppMessage({ gb: customState.gb, minutes: customState.minutes, schedule, price }) : "";
    const canSubscribe = Boolean(phone && message && Number.isFinite(price));
    if (elements.customSubscribe) {
      elements.customSubscribe.setAttribute("aria-disabled", String(!canSubscribe));
      elements.customSubscribe.href = canSubscribe ? baseWhatsAppUrl(phone, message) : "#";
    }
    let statusMessage;
    let statusState;
    if (result.ok) {
      statusMessage = stale ? "تعذر تحديث المصدر الآن؛ السعر مبني على آخر بيانات صحيحة محمّلة." : "السعر محسوب مباشرة من سعر الباقة أو قاعدة التسعير النشطة.";
      statusState = stale ? "info" : "success";
    } else if (result.reason === "booking-disabled") {
      statusMessage = "لا توجد بداية مسبقة مفعّلة يمكنك اختيار الشهر الحالي.";
      statusState = "error";
    } else if (result.reason === "source-unavailable") {
      statusMessage = "بيانات Custom Pricing غير متاحة من Apps Script بعد. يلزم نشر إصدار الجسر الذي يقرأ ورقة التسعير.";
      statusState = "error";
    } else if (result.reason === "invalid") {
      statusMessage = "أدخل كميات صحيحة غير سالبة.";
      statusState = "error";
    } else {
      statusMessage = "لا توجد باقة مطابقة أو قاعدة Custom Pricing مفعّلة لهذه الكميات. لم نعرض سعرًا تقديريًا.";
      statusState = "error";
    }
    setCustomStatus([statusMessage, capAdjustmentMessage].filter(Boolean).join(" "), capAdjustmentMessage ? "warning" : statusState);
  }

  function updateChrome() {
    const settings = sourceSettings();
    const phone = validWhatsAppNumber(settings.whatsappNumber);
    const whatsAppUrl = baseWhatsAppUrl(phone);
    const whatsAppGroup = trustedGroupLink(settings.whatsappGroupUrl);
    const telegram = trustedTelegramLink(settings.telegramGroupUrl);
    const showWhatsApp = Boolean(settings.showWhatsApp && whatsAppUrl);
    const showWhatsAppGroup = Boolean(settings.showWhatsAppGroup && whatsAppGroup);
    const showTelegram = Boolean(settings.showTelegram && telegram);

    [elements.headerWhatsapp, elements.heroWhatsapp, elements.footerWhatsapp].forEach((link) => {
      if (!link) return;
      link.hidden = !showWhatsApp;
      if (showWhatsApp) link.href = whatsAppUrl;
    });
    if (elements.contactPhone) {
      elements.contactPhone.hidden = !showWhatsApp;
      if (showWhatsApp) {
        elements.contactPhone.href = baseWhatsAppUrl(phone, "عايز أعرف تفاصيل الباقات");
        if (elements.contactPhoneText) elements.contactPhoneText.textContent = displayWhatsAppNumber(settings.whatsappNumber);
      }
    }
    if (elements.groupLink) {
      elements.groupLink.hidden = !showWhatsAppGroup;
      if (showWhatsAppGroup) elements.groupLink.href = whatsAppGroup;
    }
    if (elements.telegramLink) {
      elements.telegramLink.hidden = !showTelegram;
      if (showTelegram) elements.telegramLink.href = telegram;
    }
    if (elements.contactBar) elements.contactBar.hidden = !(showWhatsApp || showWhatsAppGroup || showTelegram);

    if (elements.searchWrap) {
      const showSearch = settings.showSearch && selectedCategory !== "custom";
      elements.searchWrap.hidden = !showSearch;
      elements.searchWrap.parentElement?.classList.toggle("search-hidden", !showSearch);
      if (!showSearch && elements.searchInput) {
        elements.searchInput.value = "";
        searchText = "";
      }
    }
    if (elements.finalNote) elements.finalNote.hidden = !settings.showNotes;
    if (elements.lastUpdated) {
      const formatted = settings.showLastUpdated ? formatUpdatedAt(currentData?.fetchedAt) : "";
      elements.lastUpdated.hidden = !formatted;
      elements.lastUpdated.textContent = formatted ? `آخر تحديث مؤكد: ${formatted}` : "";
    }
    renderAnnouncements();
    renderAddOns(currentData?.addOns ?? []);
    renderPaymentMethods();
  }

  function categoryPlans(categoryId) {
    if (!currentData) return [];
    if (categoryId === "all") {
      const activeIds = new Set(core.visibleCategories(currentData.settings).filter((item) => item.id !== "all").map((item) => item.id));
      return (currentData.plans.all ?? []).filter((plan) => activeIds.has(plan.categoryId));
    }
    return currentData.plans[categoryId] ?? [];
  }

  function renderHeaderStats(visiblePlans = [], categoryLabel = "") {
    if (!currentData) return;
    if (elements.count) elements.count.textContent = formatNumber(visiblePlans.length);
    if (!elements.range || !elements.title) return;
    const values = visiblePlans.map((plan) => plan.gb).filter(Number.isFinite).sort((left, right) => left - right);
    if (!values.length) {
      elements.range.textContent = categoryLabel ? `لا توجد باقات في ${categoryLabel}` : "لا توجد باقات صالحة حاليًا";
      elements.title.textContent = "باقات WE المخصصة";
      return;
    }
    const min = core.formatGigabytes(values[0]);
    const max = core.formatGigabytes(values[values.length - 1]);
    const range = min === max ? `${min} جيجا` : `من ${min} إلى ${max} جيجا`;
    elements.range.textContent = range;
    elements.title.replaceChildren(
      document.createTextNode("باقات "),
      make("b", "heading-we we-mark", "WE"),
      document.createTextNode(` ${range}`),
    );
  }

  function renderTabs() {
    if (!elements.tabs || !elements.filterSection || !currentData) return;
    const categories = core.visibleCategories(currentData.settings).filter((category) =>
      category.id === "all"
        ? (currentData.plans.all ?? []).length > 0
        : (currentData.plans[category.id] ?? []).length > 0,
    );
    categories.push({ id: "custom", label: "خصص باقتك بنفسك" });
    if (!categories.some((category) => category.id === selectedCategory)) selectedCategory = categories[0]?.id ?? "all";
    elements.tabs.replaceChildren();
    categories.forEach((category) => {
      const button = make("button", "category-tab", category.label);
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(selectedCategory === category.id));
      button.addEventListener("click", () => {
        selectedCategory = category.id;
        updateChrome();
        renderTabs();
        renderCards();
      });
      elements.tabs.append(button);
    });
    elements.filterSection.hidden = categories.length === 0;
  }

  function packageName(plan) {
    return plan.name || `باقة ${core.formatGigabytes(plan.gb)} جيجا`;
  }

  function currentPrice(plan) {
    return plan.discountEligible && Number.isFinite(plan.offer?.finalPrice) ? plan.offer.finalPrice : plan.finalPrice;
  }

  function planDurationLabel(plan, categoryLabel, categoryId) {
    if (categoryId === "all") return core.CATEGORY_LABELS.all;
    return categoryLabel || plan.categoryLabel || "";
  }

  function detailsText(plan, categoryLabel = "", categoryId = plan.categoryId) {
    const price = currentPrice(plan);
    const lines = [
      packageName(plan),
      `${core.formatGigabytes(plan.gb)} جيجا`,
      `${formatNumber(plan.minutes)} دقيقة`,
    ];
    const duration = planDurationLabel(plan, categoryLabel, categoryId);
    if (duration) lines.push(`التصنيف: ${duration}`);
    if (plan.discountEligible && plan.offer && plan.offer.finalPrice !== plan.finalPrice) {
      lines.push(`السعر الحالي: ${formatNumber(price)} جنيه بدل ${formatNumber(plan.finalPrice)} جنيه`);
    } else {
      lines.push(`السعر الحالي: ${formatNumber(price)} جنيه`);
    }
    if (plan.discountEligible && plan.offer?.discountPercent) lines.push(`الخصم: ${formatNumber(plan.offer.discountPercent)}%`);
    return lines.join("\n");
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const textarea = make("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("copy unavailable");
  }

  function actionButton(label, className, onClick) {
    const button = make("button", className, label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  }

  function planBadgeKind(value) {
    if (/أفضل\s*اختيار/u.test(value)) return "badge-best";
    if (/الأكثر\s*اختيار/u.test(value)) return "badge-popular";
    if (/جديد|new/iu.test(value)) return "badge-new";
    if (/محدود|limited/iu.test(value)) return "badge-limited";
    if (/حصري|exclusive/iu.test(value)) return "badge-exclusive";
    if (/سريع|ساخن|hot/iu.test(value)) return "badge-hot";
    if (/ينتهي|deadline/iu.test(value)) return "badge-deadline";
    return "badge-default";
  }

  function PackageBadge(value) {
    const badge = make("span", `plan-badge ${planBadgeKind(value)}`, value);
    badge.setAttribute("role", "listitem");
    return badge;
  }

  const CATEGORY_ICON_PATHS = Object.freeze({
    standard: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h3M8 16h6"/>',
    eom: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M12 12v3l2 1"/><circle cx="12" cy="14" r="4"/>',
    to15: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 14l2 2 5-5"/>',
  });

  function CategorySidebar(plan) {
    const categoryId = String(plan.categoryId ?? "");
    const label = plan.categoryLabel || core.CATEGORY_LABELS[categoryId] || "باقات WE";
    const categoryLabel = label.startsWith("باقات") ? label : `باقات ${label}`;
    const path = CATEGORY_ICON_PATHS[categoryId] || '<path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z"/><path d="M19 16v5M16.5 18.5h5"/>';
    const sidebar = make("aside", "category-rail");
    sidebar.setAttribute("aria-label", categoryLabel);
    const icon = make("span", "category-rail-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = `<svg viewBox="0 0 24 24">${path}</svg>`;
    sidebar.append(icon, make("span", "category-rail-label", categoryLabel));
    return sidebar;
  }

  function buildCard(plan, index, categoryLabel, categoryId, settings) {
    const article = make("article", "offer-card");
    const accent = PACKAGE_ACCENTS[Number(plan.gb)];
    if (accent) article.style.setProperty("--accent", accent);
    const top = make("div", "card-top");
    const sequence = make("span", "card-number", String(index + 1).padStart(2, "0"));
    top.append(sequence);

    const badgeTexts = Array.isArray(plan.badges) ? plan.badges : (plan.badge ? [plan.badge] : []);
    const badges = badgeTexts.map((value) => String(value ?? "").trim()).filter(Boolean);
    const badgeList = badges.length ? make("div", "card-badges") : null;
    if (badgeList) {
      badgeList.setAttribute("role", "list");
      badgeList.append(...badges.map(PackageBadge));
      top.append(badgeList);
    }

    const categoryRail = categoryId === "all" ? CategorySidebar(plan) : null;
    if (categoryRail) article.classList.add("has-category-sidebar");
    const amount = make("p", "data-amount");
    amount.append(make("strong", "", core.formatGigabytes(plan.gb)), make("span", "", "جيجا"));
    const minutes = make("p", "minutes");
    const phoneIcon = make("span", "phone-mark");
    phoneIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.3 3.4 10 7.1 8.4 9.2c1.1 2.5 3 4.4 5.5 5.5l2.1-1.6 2.1-1.6 3.7 2.7-.6 3c-.2 1-1.1 1.7-2.1 1.7-6.9 0-12.5-5.6-12.5-12.5 0-1 .7-1.9 1.7-2.1l2.1-.5Z"/></svg>';
    minutes.append(phoneIcon, make("b", "", formatNumber(plan.minutes)), document.createTextNode(" دقيقة"));

    const price = currentPrice(plan);
    const priceStack = make("div", "price-value-stack");
    if (plan.discountEligible && plan.offer && price !== plan.finalPrice) priceStack.append(make("del", "original-price", formatNumber(plan.finalPrice)));
    priceStack.append(make("span", "current-price", formatNumber(price)));
    const priceBand = make("div", "price-band");
    priceBand.append(priceStack, make("b", "currency", "جنيه"));
    const priceArea = make("div", "price-area");
    if (plan.discountEligible && plan.offer?.discountPercent) {
      priceArea.append(make("small", "discount-badge", `OFF ${formatNumber(plan.offer.discountPercent)}%`));
    } else if (plan.discountEligible && plan.offer?.label) {
      priceArea.append(make("small", "discount-badge", plan.offer.label));
    }
    priceArea.append(priceBand);

    article.append(...(categoryRail ? [categoryRail] : []), top, amount, minutes, priceArea);
    const phone = validWhatsAppNumber(settings.whatsappNumber);
    if (settings.showWhatsApp && phone) {
      const messageCategory = categoryId === "all" ? plan.categoryId : categoryId;
      const message = core.whatsappMessage({ ...plan, currentPrice: price }, messageCategory);
      const cta = make("a", "card-cta", "اشترك الآن");
      cta.href = baseWhatsAppUrl(phone, message);
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
      cta.setAttribute("aria-label", message);
      cta.append(make("span", "", "↗"));
      article.append(cta);
    }

    if (settings.showCopyButton || settings.showShareButton) {
      const actions = make("div", "card-actions");
      if (settings.showCopyButton) {
        actions.append(actionButton("نسخ", "card-action", async (event) => {
          const button = event.currentTarget;
          try {
            await copyText(detailsText(plan, categoryLabel, categoryId));
            button.textContent = "تم النسخ";
          } catch {
            button.textContent = "تعذر النسخ";
          }
          window.setTimeout(() => { button.textContent = "نسخ"; }, 1400);
        }));
      }
      if (settings.showShareButton) {
        actions.append(actionButton("مشاركة", "card-action", async (event) => {
          const button = event.currentTarget;
          const shareData = { title: packageName(plan), text: detailsText(plan, categoryLabel, categoryId), url: window.location.href.split("#")[0] };
          try {
            if (navigator.share) await navigator.share(shareData);
            else await copyText(`${shareData.text}\n${shareData.url}`);
            button.textContent = "تمت المشاركة";
          } catch (error) {
            if (error?.name === "AbortError") return;
            button.textContent = "تعذرت المشاركة";
          }
          window.setTimeout(() => { button.textContent = "مشاركة"; }, 1400);
        }));
      }
      article.append(actions);
    }
    return article;
  }

  function searchMatches(plan, categoryLabel, query) {
    if (!query) return true;
    const searchable = [
      packageName(plan),
      core.formatGigabytes(plan.gb),
      formatNumber(plan.minutes),
      formatNumber(plan.finalPrice),
      formatNumber(currentPrice(plan)),
      plan.badge,
      plan.categoryLabel,
      categoryLabel,
      plan.offer?.discountPercent ? formatNumber(plan.offer.discountPercent) : "",
    ].join(" ");
    return core.normalizeSearchText(searchable).includes(query);
  }

  function renderStatus(visibleCount, categoryLabel) {
    const countLabel = visibleCount === 1 ? "باقة واحدة" : `${formatNumber(visibleCount)} باقات`;
    if (visibleCount === 0) {
      setStatus(searchText ? "لا توجد باقات تطابق البحث." : "لا توجد باقات متاحة حاليًا.", "empty");
    } else if (stale) {
      setStatus(`تعذّر التحديث · ${countLabel} في ${categoryLabel}؛ نعرض آخر بيانات صحيحة.`, "stale");
    } else {
      setStatus("البيانات محدثة", "success");
    }
  }

  function renderSkeletons(count = 8) {
    if (!elements.grid) return;
    const cards = Array.from({ length: count }, () => {
      const card = make("div", "skeleton-card");
      card.setAttribute("aria-hidden", "true");
      card.append(make("span", "skeleton-pill"), make("span", "skeleton-title"), make("span", "skeleton-line skeleton-line-short"), make("span", "skeleton-price"), make("span", "skeleton-button"));
      return card;
    });
    elements.grid.replaceChildren(...cards);
    elements.grid.dataset.loading = "true";
    elements.grid.setAttribute("aria-busy", "true");
  }

  function renderCards() {
    if (!elements.grid || !currentData) return;
    if (selectedCategory === "custom") {
      elements.grid.hidden = true;
      if (elements.empty) elements.empty.hidden = true;
      if (elements.customizer) elements.customizer.hidden = false;
      if (elements.count) elements.count.textContent = "—";
      if (elements.range) elements.range.textContent = "اختار مواصفات باقتك واحسب السعر مباشرة";
      if (elements.title) elements.title.textContent = "خصص باقتك بنفسك";
      renderCustomizer();
      setStatus(stale ? "تعذر تحديث البيانات · عرض المخصص يستخدم آخر نسخة صحيحة." : "حدد تفاصيل باقتك لمشاهدة السعر المتاح.", stale ? "stale" : "success");
      return;
    }
    elements.grid.hidden = false;
    if (elements.customizer) elements.customizer.hidden = true;
    const categories = core.visibleCategories(currentData.settings).filter((entry) =>
      entry.id === "all"
        ? (currentData.plans.all ?? []).length > 0
        : (currentData.plans[entry.id] ?? []).length > 0,
    );
    const category = categories.find((entry) => entry.id === selectedCategory) ?? categories[0];
    if (!category) return;
    const query = core.normalizeSearchText(searchText);
    const visible = categoryPlans(category.id).filter((plan) => searchMatches(plan, category.label, query));
    elements.grid.replaceChildren(...visible.map((plan, index) => buildCard(plan, index, category.label, category.id, currentData.settings)));
    renderHeaderStats(visible, category.label);
    delete elements.grid.dataset.loading;
    elements.grid.setAttribute("aria-busy", "false");
    if (elements.empty) {
      elements.empty.hidden = visible.length > 0;
      elements.empty.textContent = query ? "لا توجد باقات تطابق البحث." : "لا توجد باقات في هذا التصنيف حاليًا.";
    }
    renderStatus(visible.length, category.label);
  }

  function render() {
    if (!currentData) return;
    updateChrome();
    renderTabs();
    renderCards();
  }

  function scheduleRefresh() {
    window.clearTimeout(refreshTimer);
    const endpoint = safeEndpoint(config.sheetsEndpoint);
    if (!endpoint) return;
    const seconds = currentData?.settings?.autoRefreshSeconds ?? core.DEFAULT_REFRESH_SECONDS;
    refreshTimer = window.setTimeout(refresh, seconds * 1000);
  }

  async function refresh() {
    if (loading) return;
    const endpoint = safeEndpoint(config.sheetsEndpoint);
    if (!endpoint) {
      if (!currentData) setStatus("مصدر Google Sheets غير مُهيأ بعد؛ ستظهر الباقات بعد ربطه.", "error");
      return;
    }

    loading = true;
    window.clearTimeout(loadingTimer);
    if (!currentData) {
      renderSkeletons();
      setStatus("جاري تحميل الباقات...", "loading");
      loadingTimer = window.setTimeout(() => {
        if (loading && !currentData) setStatus("التحميل يستغرق وقتًا أطول من المعتاد…", "slow");
      }, 3500);
    } else {
      setStatus("جاري تحديث البيانات...", "info");
    }

    try {
      const response = await jsonp(endpoint);
      const normalized = core.normalizePayload(response);
      if (!normalized.ok) throw new Error("invalid source response");
      currentData = normalized;
      stale = false;
      writeCache(response);
      render();
    } catch {
      if (!currentData) currentData = readCache();
      if (currentData) {
        stale = true;
        render();
      } else {
        stale = false;
        if (elements.grid) {
          elements.grid.replaceChildren();
          delete elements.grid.dataset.loading;
          elements.grid.setAttribute("aria-busy", "false");
        }
        if (elements.filterSection) elements.filterSection.hidden = true;
        if (elements.empty) elements.empty.hidden = true;
        updateChrome();
        setStatus("تعذر تحميل بيانات الباقات حاليًا. حاول مرة أخرى لاحقًا.", "error");
      }
    } finally {
      window.clearTimeout(loadingTimer);
      loading = false;
      if (currentData) renderCards();
      else if (elements.status) elements.status.setAttribute("aria-busy", "false");
      scheduleRefresh();
    }
  }

  function scrollToFirstResult() {
    if (!core.normalizeSearchText(searchText)) return;
    const firstCard = elements.grid?.querySelector(".offer-card");
    if (!firstCard) return;
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + firstCard.getBoundingClientRect().top - headerHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function initialize() {
    if (elements.retryButton) elements.retryButton.addEventListener("click", refresh);
    elements.customBilling?.querySelectorAll("[data-billing]").forEach((button) => button.addEventListener("click", () => {
      customState.billing = button.dataset.billing;
      updateChrome();
      renderCustomizer();
    }));
    elements.customDurationMode?.querySelectorAll("[data-future-mode]").forEach((button) => button.addEventListener("click", () => {
      customState.futureMode = button.dataset.futureMode;
      renderCustomizer();
    }));
    elements.customizer?.querySelectorAll("[data-control][data-step]").forEach((button) => button.addEventListener("click", () => {
      const key = button.dataset.control;
      const step = key === "minutes" ? 50 : 1;
      customNumber(key, customState[key] + Number(button.dataset.step) * step);
    }));
    [["gb", elements.customGbRange, elements.customGbNumber], ["days", elements.customDaysRange, elements.customDaysNumber]].forEach(([key, range, number]) => {
      range?.addEventListener("input", () => customNumber(key, range.value));
      number?.addEventListener("input", () => customNumber(key, number.value, { preserveControl: number }));
      number?.addEventListener("change", () => customNumber(key, number.value));
    });
    elements.customMinutesRange?.addEventListener("input", () => customNumber("minutes", elements.customMinutesRange.value));
    elements.customMinutesNumber?.addEventListener("focus", () => { minutesEditing = true; });
    elements.customMinutesNumber?.addEventListener("input", () => { minutesEditing = true; });
    elements.customMinutesNumber?.addEventListener("change", commitMinutesInput);
    elements.customMinutesNumber?.addEventListener("blur", commitMinutesInput);
    elements.customMinutesNumber?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        elements.customMinutesNumber.blur();
      }
    });
    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", () => {
        searchText = elements.searchInput.value;
        renderCards();
      });
      elements.searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          scrollToFirstResult();
        }
      });
    }

    const endpoint = safeEndpoint(config.sheetsEndpoint);
    if (!endpoint) {
      if (elements.grid) elements.grid.replaceChildren();
      if (elements.filterSection) elements.filterSection.hidden = true;
      if (elements.empty) elements.empty.hidden = true;
      updateChrome();
      setStatus("مصدر Google Sheets غير مُهيأ بعد؛ ستظهر الباقات بعد ربطه.", "error");
      return;
    }

    updateChrome();
    renderSkeletons();
    const cached = readCache();
    if (cached) {
      currentData = cached;
      stale = true;
      render();
      setStatus("جارٍ التحقق من أحدث بيانات الباقات…", "stale");
    }
    refresh();
    window.addEventListener("online", refresh);
  }

  try {
    initialize();
  } catch (error) {
    loading = false;
    console.error("WE Offers initialization failed", error);
    if (elements.status) setStatus("تعذر تهيئة الباقات حاليًا. حاول إعادة التحميل.", "error");
  }
})();

(() => {
  const stack = document.getElementById("top-stack");
  const bar = document.getElementById("announcement-bar");
  const root = document.documentElement;
  const syncHeight = () => root.style.setProperty("--announce-h", !bar || bar.hidden ? "0px" : `${bar.offsetHeight}px`);
  let scrolled = false;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (!scrolled && y > 160) scrolled = true;
    else if (scrolled && y < 30) scrolled = false;
    stack?.classList.toggle("is-scrolled", scrolled);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncHeight);
  if (bar) new MutationObserver(syncHeight).observe(bar, { attributes: true, childList: true, subtree: true, characterData: true });
  syncHeight();
  onScroll();
})();
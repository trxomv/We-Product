import { make } from "../utils/dom.js";

const ICONS = Object.freeze({
  minutes: new URL("../../assets/icons/addon-phone.svg", import.meta.url).href,
  data: new URL("../../assets/icons/addon-data.svg", import.meta.url).href,
  generic: new URL("../../assets/icons/addon-generic.svg", import.meta.url).href,
});

export function classifyAddon(bundle) {
  const value = String(bundle ?? "").normalize("NFKC").toLowerCase();
  if (/min|minute|دقيق|دقايق/u.test(value)) return "minutes";
  if (/gb|giga|ميجا|mbyte|\bmb\b|جيجا/u.test(value)) return "data";
  return "generic";
}

export function describeAddon(item = {}) {
  const bundle = String(item.bundle ?? "").trim();
  const type = classifyAddon(bundle);
  if (type === "minutes") return { type, name: "دقائق إضافية", quantityUnit: "دقيقة" };
  if (type === "data") {
    const quantityUnit = /mb|mbyte|ميجا/i.test(bundle) ? "ميجا" : "جيجا";
    return { type, name: "إنترنت إضافي", quantityUnit };
  }
  return { type, name: bundle || "إضافة إضافية", quantityUnit: bundle || "وحدة" };
}

export function createAddonRow(item, { formatNumber = String } = {}) {
  const description = describeAddon(item);
  const row = make("div", "addon-row");
  const icon = make("img", "addon-icon");
  icon.src = ICONS[description.type] || ICONS.generic;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  icon.loading = "lazy";
  icon.decoding = "async";
  icon.dataset.addonType = description.type;

  const copy = make("div", "addon-copy");
  copy.append(
    make("b", "addon-name", description.name),
    make("span", "addon-details", `${formatNumber(item.quota)} ${description.quantityUnit}`),
  );
  const price = make("strong", "addon-price", `${formatNumber(item.price)} جنيه`);

  row.append(icon, copy, price);
  return row;
}

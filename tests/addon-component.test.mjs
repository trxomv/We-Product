import test from "node:test";
import assert from "node:assert/strict";
import { classifyAddon, createAddonRow, describeAddon } from "../public/js/components/addon-row.js";
import { formatNumber } from "../public/js/utils/format.js";

function withFakeDocument(callback) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  globalThis.document = {
    createElement(tagName) {
      return {
        tagName,
        className: "",
        textContent: "",
        dataset: {},
        attributes: {},
        children: [],
        setAttribute(name, value) { this.attributes[name] = value; },
        append(...children) { this.children.push(...children); },
      };
    },
  };
  try {
    callback();
  } finally {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  }
}

test("Add-on icon type follows Sheet bundle names and has a future-safe fallback", () => {
  assert.equal(classifyAddon("Minutes"), "minutes");
  assert.equal(classifyAddon("1200 دقيقة"), "minutes");
  assert.equal(classifyAddon("GBs"), "data");
  assert.equal(classifyAddon("2 جيجا"), "data");
  assert.equal(classifyAddon("100 MB"), "data");
  assert.equal(classifyAddon("SMS"), "generic");
});

test("Add-on details remain data-driven and choose an appropriate unit", () => {
  assert.deepEqual(describeAddon({ bundle: "Minutes" }), {
    type: "minutes",
    name: "دقائق إضافية",
    quantityUnit: "دقيقة",
  });
  assert.equal(describeAddon({ bundle: "GBs" }).quantityUnit, "جيجا");
  assert.equal(describeAddon({ bundle: "MB" }).quantityUnit, "ميجا");
  assert.equal(describeAddon({ bundle: "SMS" }).name, "SMS");
});

test("Add-on rows contain only icon, information and price—no selection control", () => {
  withFakeDocument(() => {
    const row = createAddonRow({ bundle: "GBs", quota: 1200, price: 85 }, { formatNumber });
    assert.equal(row.tagName, "div");
    assert.equal(row.className, "addon-row");
    assert.deepEqual(row.children.map((child) => [child.tagName, child.className]), [
      ["img", "addon-icon"],
      ["div", "addon-copy"],
      ["strong", "addon-price"],
    ]);
    assert.equal(row.children[0].dataset.addonType, "data");
    assert.equal(row.children[1].children[0].textContent, "إنترنت إضافي");
    assert.equal(row.children[1].children[1].textContent, "1,200 جيجا");
    assert.equal(row.children[2].textContent, "85 جنيه");
    assert.ok(row.children.every((child) => child.tagName !== "input"));
  });
});

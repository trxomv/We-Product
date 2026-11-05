import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
const spreadsheetId = "1njuAIxAfHpQXqNazapKEca-NQ_Czd-yj5GzRSpguVuA";

function sheet(values) {
  return {
    getDataRange() {
      return {
        getValues: () => values,
        getFormulas: () => values.map((row) => row.map(() => "")),
      };
    },
  };
}

test("Apps Script reads enabled ads from Announcements and only the two Payment Methods columns", () => {
  const workbook = new Map([
    ["Rate Plans-Website", sheet([["No. of Plan", "MBs", "Minutes", "Final Price", "Show Rate Plan"], [1, 10000, 1100, 210, true]])],
    ["Rate Plans to EOM-Website", sheet([["No. of Plan", "MBs", "Minutes", "Final Price", "Show"], [1, 5000, 500, 170, true]])],
    ["Rate Plans to 15-Website", sheet([["No. of Plan", "MBs", "Minutes", "Final Price", "Show"], [1, 10000, 1100, 100, true]])],
    ["Rate Plans_OFFER-Website", sheet([["No. of Plan", "Final Price", "Show Offer"], [1, 190, true]])],
    ["Website Settings", sheet([["Settings", "Value", "Enable"], ["Show Offers Globally", "--", true]])],
    ["Announcements", sheet([
      ["No.", "Value", "Enable"],
      [2, "الإعلان الثاني", true],
      [1, "إعلان مخفي", false],
      [3, "", true],
      [4, "--", true],
    ])],
    ["Payment Methods", sheet([["Payment Method", "Enable"], ["Payment_Vodafone_Cash", true], ["Payment_Orange_Cash", false]])],
    ["Add-on", sheet([["Bundle", "Quota", "Price"], ["GBs", 2, 15]])],
    ["Internal Subscribers", sheet([["Phone", "Name"], ["01000000000", "private"]])],
  ]);
  const requestedSheets = [];
  let cachedKey = "";
  const cache = {
    get(key) { cachedKey = key; return null; },
    put(key) { cachedKey = key; },
    remove() {},
  };
  const context = vm.createContext({
    CacheService: { getScriptCache: () => cache },
    SpreadsheetApp: {
      openById(id) {
        assert.equal(id, spreadsheetId);
        return {
          getSheetByName(name) {
            requestedSheets.push(name);
            return workbook.get(name) || null;
          },
        };
      },
    },
    console: { error() {} },
  });

  vm.runInContext(source, context);
  const payload = JSON.parse(JSON.stringify(context.cachedPayload_()));

  assert.equal(payload.ok, true);
  assert.deepEqual(Object.keys(payload.sheets).sort(), ["addons", "announcements", "eom", "offers", "paymentMethods", "settings", "standard", "to15"].sort());
  assert.deepEqual(payload.sheets.announcements.rows, [{ "No.": 2, Value: "الإعلان الثاني", Enable: true }]);
  assert.deepEqual(payload.sheets.announcements.headers, ["No.", "Value", "Enable"]);
  assert.deepEqual(payload.sheets.paymentMethods.rows, [
    { "Payment Method": "Payment_Vodafone_Cash", Enable: true },
    { "Payment Method": "Payment_Orange_Cash", Enable: false },
  ]);
  assert.deepEqual(payload.sheets.paymentMethods.headers, ["Payment Method", "Enable"]);
  assert.equal(requestedSheets.includes("Internal Subscribers"), false);
  assert.equal(cachedKey, "weoffers_public_payload_v7_announcements");
});

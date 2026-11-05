import test from "node:test";
import assert from "node:assert/strict";
import { paymentLogoCandidates, paymentLogoInitials } from "../public/js/components/payment-logo.js";

test("payment logo resolver supports explicit assets and custom filenames derived from the Sheet method name", () => {
  const known = paymentLogoCandidates(
    { id: "vodafone_cash", label: "Vodafone Cash" },
    { vodafone_cash: { src: "assets/payment-methods/vodafone-cash.webp" } },
  );
  assert.deepEqual(known, [
    "assets/payment-methods/vodafone-cash.webp",
    "assets/payment-methods/vodafone-cash.png",
    "assets/payment-methods/vodafone-cash.svg",
    "assets/payment-methods/vodafone-cash.jpg",
    "assets/payment-methods/vodafone-cash.jpeg",
  ]);

  const custom = paymentLogoCandidates({ id: "sheet_custom_wallet", label: "Custom Wallet" });
  assert.deepEqual(custom, [
    "assets/payment-methods/custom-wallet.webp",
    "assets/payment-methods/custom-wallet.png",
    "assets/payment-methods/custom-wallet.svg",
    "assets/payment-methods/custom-wallet.jpg",
    "assets/payment-methods/custom-wallet.jpeg",
  ]);

  const arabic = paymentLogoCandidates({ id: "sheet_644_627", label: "كاش سريع" });
  assert.ok(arabic[0].startsWith("assets/payment-methods/%D9%83%D8%A7%D8%B4-%D8%B3%D8%B1%D9%8A%D8%B9.webp"));
  assert.equal(paymentLogoInitials("Custom Wallet"), "CW");
});

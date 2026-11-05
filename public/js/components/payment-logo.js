const IMAGE_EXTENSIONS = Object.freeze(["webp", "png", "svg", "jpg", "jpeg"]);

function paymentSlug(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function paymentLogoCandidates(method, explicitAssets = {}) {
  const id = String(method?.id ?? "");
  const explicitPath = explicitAssets?.[id]?.src;
  const rawId = id.replace(/^sheet_/i, "");
  const slugs = [...new Set([paymentSlug(method?.label), paymentSlug(rawId)].filter(Boolean))];
  const candidates = [];

  if (typeof explicitPath === "string" && explicitPath) candidates.push(explicitPath);
  for (const slug of slugs) {
    const encodedSlug = encodeURIComponent(slug);
    for (const extension of IMAGE_EXTENSIONS) {
      candidates.push(`assets/payment-methods/${encodedSlug}.${extension}`);
    }
  }
  return [...new Set(candidates)];
}

export function paymentLogoInitials(label) {
  return String(label ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => [...word][0] ?? "")
    .join("")
    .toUpperCase();
}

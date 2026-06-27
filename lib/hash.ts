import crypto from "crypto";

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    return Object.keys(input)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        if (input[key] !== undefined) {
          acc[key] = sortValue(input[key]);
        }
        return acc;
      }, {});
  }

  return value;
}

export function sha256Hex(value: unknown): string {
  return crypto.createHash("sha256").update(canonicalJson(value)).digest("hex");
}

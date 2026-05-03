import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 8,
});

/**
 * Encodes a UUID into a short, URL-safe hash.
 */
export function encodeId(uuid: string): string {
  if (!uuid || typeof uuid !== "string") return "";
  
  // Basic validation for UUID-like string
  const cleanUuid = uuid.replace(/-/g, "");
  if (cleanUuid.length !== 32) return uuid; // Fallback if not a standard UUID

  try {
    const chunks = [
      parseInt(cleanUuid.slice(0, 8), 16),
      parseInt(cleanUuid.slice(8, 16), 16),
      parseInt(cleanUuid.slice(16, 24), 16),
      parseInt(cleanUuid.slice(24, 32), 16),
    ];
    return sqids.encode(chunks);
  } catch (e) {
    console.error("Failed to encode ID:", e);
    return uuid;
  }
}

/**
 * Decodes a hash back into a UUID.
 */
export function decodeId(hash: string): string {
  if (!hash || typeof hash !== "string") return "";
  
  // If it looks like a UUID already, return it
  if (hash.includes("-") && hash.length === 36) return hash;

  try {
    const chunks = sqids.decode(hash);
    if (chunks.length !== 4) return hash; // Fallback or invalid hash

    const hex = chunks.map((c) => c.toString(16).padStart(8, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } catch (e) {
    console.error("Failed to decode ID:", e);
    return hash;
  }
}

/**
 * A stable id for this browser, sent with review submissions so the owner can block a spammer.
 * Built from browser and screen properties (no storage, so clearing cookies doesn't change it).
 * The backend only stores a hash of it.
 */
export async function getBrowserFingerprint(): Promise<string> {
  const source = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(","),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    window.devicePixelRatio,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency,
    navigator.maxTouchPoints,
  ].join("|");

  // crypto.subtle only exists on HTTPS and localhost.
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return fnv1a(source);
}

/** Small non-cryptographic hash, as a 16-character hex string. */
function fnv1a(value: string): string {
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < value.length; i++) {
    hash ^= BigInt(value.charCodeAt(i));
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, "0");
}

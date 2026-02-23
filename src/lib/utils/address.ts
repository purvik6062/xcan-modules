/**
 * Escapes special regex characters in a string for safe use in RegExp
 */
function escapeRegex(str: string): string {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns a case-insensitive regex pattern for exact address matching.
 * Use for MongoDB: { field: addressRegexCaseInsensitive(value) }
 */
export function addressRegexCaseInsensitive(address: string): RegExp {
  return new RegExp(`^${escapeRegex(address)}$`, "i");
}

/**
 * Returns MongoDB query object for case-insensitive address match.
 * Use: { field: addressMatchQuery(value) }
 */
export function addressMatchQuery(address: string): { $regex: RegExp } {
  return { $regex: addressRegexCaseInsensitive(address) };
}

/**
 * Returns true if two addresses match (case-insensitive).
 * Use for client-side or in-memory comparisons.
 */
export function addressesMatch(a: string, b: string): boolean {
  return addressRegexCaseInsensitive(a).test(b);
}

import {
  MODULE_ID_MAP,
  normalizeModuleId,
  type ModuleIdentifier,
} from "@/lib/database/module-collections";

const PREFIX_BY_MODULE: Record<string, string> = {
  "web3-basics": "W3B",
  "stylus-core-concepts": "SCC",
  "precompiles-overview": "PO",
  "cross-chain": "CC",
  "master-defi": "MD",
  "master-orbit": "MO",
  "eigen-ai": "EA",
};

function prefixFromCanonicalModuleId(moduleId: string): string {
  if (PREFIX_BY_MODULE[moduleId]) return PREFIX_BY_MODULE[moduleId];

  const parts = String(moduleId)
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean);
  const initials = parts.map((p) => p[0]?.toUpperCase()).join("");
  return (initials || "CERT").slice(0, 6);
}

/** Canonical module id (e.g. web3-basics) — same as API `normalizeModuleId` output */
export function getCertificatePrefixFromCanonicalModuleId(
  moduleId: string
): string {
  return prefixFromCanonicalModuleId(moduleId);
}

/**
 * Route / UI slug (e.g. defi-arbitrum, web3-basics, xcan-advocate).
 * Resolves aliases via MODULE_ID_MAP when present.
 */
export function getCertificatePrefixForModuleKey(routeOrModuleKey: string): string {
  const key = routeOrModuleKey.trim();
  const mapped = MODULE_ID_MAP[key];
  const canonical = mapped ?? normalizeModuleId(key as ModuleIdentifier);
  return prefixFromCanonicalModuleId(canonical);
}

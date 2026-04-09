/**
 * Legacy session flag from when the post-GitHub name modal allowed "Skip for now".
 * Past students who skipped keep this key so they are not blocked by the modal today.
 * New users cannot set this flag (skip removed); cleared when a certificate name is saved.
 */

export function deferCertNameStorageKey(walletAddress: string): string {
  return `xcan_defer_cert_name_${walletAddress.toLowerCase()}`;
}

export function clearDeferredCertNamePrompt(walletAddress: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(deferCertNameStorageKey(walletAddress));
}

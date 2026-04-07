"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PromoCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onMint: () => Promise<void> | void;
  address?: string | null;
};

export default function PromoCodeModal({ isOpen, onClose, onMint, address }: PromoCodeModalProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check if user has already verified promo code before
  useEffect(() => {
    if (!isOpen) {
      try {
        document.body.style.removeProperty("overflow");
      } catch { }
      return;
    }

    try {
      document.body.style.setProperty("overflow", "hidden");
    } catch { }

    // Reset state on open
    setCode("");
    setError(null);
    setIsSubmitting(false);
    setIsMinting(false);
    setIsVerified(false);

    // If user has a wallet connected, check if they've already verified
    if (address) {
      setIsCheckingStatus(true);
      fetch(`/api/promo/check-status?userAddress=${encodeURIComponent(address)}`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.verified) {
            setIsVerified(true);
          }
        })
        .catch(() => { })
        .finally(() => setIsCheckingStatus(false));
    }
  }, [isOpen, address]);

  const setTimedError = useCallback((message: string) => {
    setError(message);
    const timer = setTimeout(() => {
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userAddress: address || "" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTimedError(data?.message || "Invalid promo code");
        return;
      }
      setIsVerified(true);
    } catch (e) {
      setTimedError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1226]/70 via-[#08182f]/70 to-[#061225]/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-slate-900/90 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {/* subtle gradient border */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-fuchsia-500/20 blur-2xl" />
            </div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Claim NFT Certification</h3>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {isCheckingStatus ? (
                /* Loading state while checking promo status */
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <svg className="animate-spin w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-slate-400 text-sm">Checking your promo code status...</p>
                </div>
              ) : (
                /* Subscription-style layout */
                <div className="space-y-5">
                  {/* Total price */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3">
                    <div className="text-sm text-slate-300">Total</div>
                    <div className={`text-lg font-semibold ${isVerified ? "text-emerald-400" : "text-slate-100"}`}>
                      {isVerified ? "$0" : "$50"}
                    </div>
                  </div>

                  {/* Pay via Crypto — disabled/blurred, not clickable */}
                  <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-4 opacity-40 cursor-not-allowed">
                    <div className="flex flex-col">
                      <div>
                        <div className="text-base font-semibold text-slate-400 pb-4">Pay $50 to get your certification</div>
                      </div>
                      <div
                        className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(135deg,#22d3ee_0%,#3b82f6_50%,#8b5cf6_100%)] shadow-lg shadow-cyan-500/10 text-center select-none"
                        style={{ cursor: "not-allowed" }}
                      >
                        Pay via Crypto
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-700/60" />
                    <span className="text-xs text-slate-400">or</span>
                    <div className="h-px flex-1 bg-slate-700/60" />
                  </div>

                  {/* Promo code */}
                  <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-100">Have a promo code?</div>
                    <p className="text-xs text-slate-400 mb-3">Enter your promo code below to waive the $50 fee and mint your certification for free.</p>
                    {!isVerified ? (
                      <div className="space-y-3">
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="w-full rounded-lg bg-slate-900/60 border border-slate-700/80 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                        />
                        {error && <div className="text-sm text-rose-400">{error}</div>}
                        <button
                          onClick={submit}
                          disabled={isSubmitting || !code}
                          className={`${isSubmitting || !code ? "cursor-not-allowed bg-slate-700 text-slate-400" : "cursor-pointer bg-[linear-gradient(135deg,#5b8cff_0%,#3ab7ff_50%,#22d3ee_100%)] hover:brightness-110 text-white shadow-lg shadow-cyan-600/20"} w-full rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
                        >
                          {isSubmitting && (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          <span>Verify Code</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          <span>Promo code verified</span>
                        </div>
                        <button
                          onClick={async () => {
                            if (isMinting) return;
                            setIsMinting(true);
                            try { await onMint(); onClose(); } catch { /* handled by caller */ } finally { setIsMinting(false); }
                          }}
                          disabled={isMinting}
                          className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-[conic-gradient(at_0%_0%,#34d399_0%,#06b6d4_25%,#3b82f6_50%,#8b5cf6_75%,#34d399_100%)] text-white shadow-lg shadow-emerald-600/20 ${isMinting ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:scale-[1.01] active:scale-[0.99]"}`}
                        >
                          {isMinting ? (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" /></svg>
                          )}
                          <span>{isMinting ? "Minting..." : "Mint Now"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

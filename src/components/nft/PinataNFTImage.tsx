"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** Tiny neutral blur for `placeholder="blur"` while IPFS/Pinata bytes stream in */
const NFT_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

function isIpfsGatewayUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.includes("pinata") ||
      host.includes("ipfs") ||
      url.includes("/ipfs/")
    );
  } catch {
    return false;
  }
}

interface PinataNFTImageProps {
  src: string;
  alt: string;
  /** Outer wrapper; keeps aspect ratio and loading shell */
  className?: string;
  /** Applied to the optimized `Image` (e.g. hover scale) */
  imgClassName?: string;
  /** LCP / hero: higher fetch priority */
  priority?: boolean;
  /** Default: true for Pinata/IPFS hosts (direct browser fetch, avoids optimizer round-trip) */
  unoptimized?: boolean;
}

export function PinataNFTImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  unoptimized,
}: PinataNFTImageProps) {
  const resolvedSrc = src?.trim() || "/placeholder.svg";
  const isRemote = resolvedSrc.startsWith("http");
  const useUnoptimized =
    unoptimized !== undefined ? unoptimized : isIpfsGatewayUrl(resolvedSrc);

  const [loaded, setLoaded] = useState(!isRemote);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const remote = resolvedSrc.startsWith("http");
    setLoaded(!remote);
    setError(false);
  }, [resolvedSrc]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  }, []);

  const showLoadingOverlay = isRemote && !loaded && !error;

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-slate-800/90 ${className}`}
    >
      {showLoadingOverlay && (
        <div
          className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 p-4"
          aria-hidden
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-700/80 via-slate-800/80 to-slate-900/90" />
          <div className="relative h-9 w-9 rounded-full border-2 border-emerald-400/30 border-t-emerald-400/90 animate-spin" />
          <p className="relative text-center text-xs text-slate-400">
            Loading artwork…
          </p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-slate-900/95 p-4 text-center">
          <p className="text-sm text-slate-300">Couldn&apos;t load image</p>
          <p className="text-xs text-slate-500">
            Network or gateway may be slow. Try again.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
          >
            Retry
          </button>
        </div>
      )}

      <Image
        key={`${resolvedSrc}-${retryKey}`}
        src={resolvedSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28rem"
        className={`object-cover transition-opacity duration-500 ease-out ${loaded && !error ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        placeholder={isRemote ? "blur" : "empty"}
        blurDataURL={isRemote ? NFT_BLUR_DATA_URL : undefined}
        priority={priority}
        unoptimized={useUnoptimized}
        onLoadingComplete={() => {
          setLoaded(true);
          setError(false);
        }}
        onError={() => {
          setError(true);
          setLoaded(false);
        }}
      />
    </div>
  );
}

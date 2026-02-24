"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Eye, Clock, ExternalLink } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Real video data from https://www.youtube.com/@xcan_arbitrum/videos
// IDs extracted from the URLs provided by the team.
// Thumbnail: YouTube CDN  →  img.youtube.com/vi/{ID}/hqdefault.jpg
// ─────────────────────────────────────────────────────────────────────────────
const YOUTUBE_VIDEOS = [
    // ── Row 1 (6 videos) ──────────────────────────────────────────────────────
    {
        id: "M1-AmTsrU3A",
        title: "Introduction to Web3: A Complete Beginner's Guide",
        shortTitle: "Introduction to Web3",
        duration: "26:28",
        views: "304",
        uploadedAgo: "3 months ago",
    },
    {
        id: "Wpdadlx3j_o",
        title: "Understanding Smart Contracts & Stylus on Arbitrum",
        shortTitle: "Understanding Smart Contracts & Stylus on Arbitrum",
        duration: "7:03",
        views: "62",
        uploadedAgo: "3 months ago",
    },
    {
        id: "9cALHJ1gzME",
        title: "Introduction to Rust Programming Language | Learn Rust from Scratch",
        shortTitle: "Introduction to Rust Programming Language",
        duration: "39:49",
        views: "267",
        uploadedAgo: "3 months ago",
    },
    {
        id: "mP6pXtd7NWo",
        title: "Foundation Challenge | Build and Deploy an ERC20 Token on Arbitrum using Rust",
        shortTitle: "Build and Deploy an ERC20 Token on Arbitrum using Rust",
        duration: "37:13",
        views: "43",
        uploadedAgo: "3 months ago",
    },
    {
        id: "-Zm7NubPXaI",
        title: "Introduction to Arbitrum Stylus and the Nitro Devnode",
        shortTitle: "Introduction to Arbitrum Stylus and the Nitro Devnode",
        duration: "18:45",
        views: "24",
        uploadedAgo: "3 months ago",
    },
    {
        id: "SQotELDEbxg",
        title: "Stylus Rust SDK Explained: Writing Secure Rust Smart Contracts on Arbitrum",
        shortTitle: "Stylus Rust SDK Explained",
        duration: "14:21",
        views: "21",
        uploadedAgo: "3 months ago",
    },

    // ── Row 2 (7 videos) ──────────────────────────────────────────────────────
    {
        id: "ufp0jSr6fn8",
        title: "Building a Vending Machine DApp on Arbitrum Stylus with Rust | Speedrun Stylus…",
        shortTitle: "Building a Vending Machine DApp on Arbitrum Stylus with Rust",
        duration: "11:38",
        views: "22",
        uploadedAgo: "2 months ago",
    },
    {
        id: "PRSi5wsZhPk",
        title: "Introduction to Arbitrum Orbit: Building and Deploying Your Own L3 Chain",
        shortTitle: "Introduction to Arbitrum Orbit",
        duration: "21:43",
        views: "154",
        uploadedAgo: "2 months ago",
    },
    {
        id: "nxvxKDudZfQ",
        title: "Arbitrum Pre-compiles Explained: A Beginner's Guide to System-Level Contracts",
        shortTitle: "Arbitrum Pre-compiles Explained",
        duration: "23:22",
        views: "20",
        uploadedAgo: "2 months ago",
    },
    {
        id: "3kUUneDoTFE",
        title: "Introduction to Cross-Chain Development",
        shortTitle: "Cross-Chain Development on Arbitrum",
        duration: "28:35",
        views: "11",
        uploadedAgo: "2 months ago",
    },
    {
        id: "1MJpQRD07UM",
        title: "How Caching Works in Arbitrum Stylus | Rust Smart Contract Optimization",
        shortTitle: "How Caching Works in Arbitrum Stylus",
        duration: "17:00",
        views: "13",
        uploadedAgo: "2 months ago",
    },
    {
        id: "HYj1oicGqNw",
        title: "Fundamentals of DeFi on Arbitrum | Complete Guide Powered by XCAN",
        shortTitle: "Fundamentals of DeFi on Arbitrum",
        duration: "12:03",
        views: "24",
        uploadedAgo: "1 months ago",
    },
    {
        id: "DzcVgkuN_eE",
        title: "How Meetings Work on Xcan: From Scheduling to Attestations",
        shortTitle: "How Meetings Work on Xcan",
        duration: "04:52",
        views: "10",
        uploadedAgo: "1 months ago",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Row 1 → first 6  |  Row 2 → remaining 7
// ─────────────────────────────────────────────────────────────────────────────
const ROW_1 = YOUTUBE_VIDEOS.slice(0, 6);
const ROW_2 = YOUTUBE_VIDEOS.slice(6);   // 7 items

// ─────────────────────────────────────────────────────────────────────────────
// Thumbnail with maxresdefault → hqdefault fallback
// YouTube CDN always has hqdefault; maxresdefault only for HD uploads.
// ─────────────────────────────────────────────────────────────────────────────
function VideoThumbnail({
    videoId,
    title,
    duration,
}: {
    videoId: string;
    title: string;
    duration: string;
}) {
    // Try maxresdefault first, then hqdefault, then branded fallback
    const [src, setSrc] = useState(
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    );
    const [fallbackUsed, setFallbackUsed] = useState(false);

    const handleError = () => {
        if (!fallbackUsed) {
            setSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
            setFallbackUsed(true);
        }
    };

    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-[#0d1b3e]">
            {/* Real YouTube thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={handleError}
                loading="lazy"
                crossOrigin="anonymous"
            />

            {/* Dark gradient overlay at bottom for duration badge readability */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Duration badge — bottom-right, like on YouTube */}
            <div className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-bold px-1.5 py-0.5 rounded leading-none">
                {duration}
            </div>

            {/* Red thin line at very bottom (YouTube brand touch) */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70" />

            {/* Play overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 shadow-2xl shadow-red-500/60 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single video card — mirrors YouTube's card layout
// ─────────────────────────────────────────────────────────────────────────────
function VideoCard({ video }: { video: (typeof YOUTUBE_VIDEOS)[number] }) {
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

    return (
        <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
                "group flex-shrink-0 w-72 flex flex-col",
                "rounded-2xl overflow-hidden",
                "bg-slate-900/60 border border-slate-700/40",
                "hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10",
                "transition-all duration-300 hover:-translate-y-1",
            ].join(" ")}
            style={{ backdropFilter: "blur(12px)" }}
        >
            {/* Thumbnail */}
            <VideoThumbnail
                videoId={video.id}
                title={video.shortTitle}
                duration={video.duration}
            />

            {/* Meta */}
            <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5">
                {/* Title — 2-line clamp, like YouTube */}
                <h3 className="text-white text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                    {video.title}
                </h3>

                {/* Views & time */}
                <div className="flex items-center gap-2.5 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views} views
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.uploadedAgo}
                    </span>
                </div>
            </div>
        </a>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Infinite auto-scrolling carousel row (CSS animation, pauses on hover)
// ─────────────────────────────────────────────────────────────────────────────
function VideoCarouselRow({
    videos,
    direction = "left",
    speed = 65,
}: {
    videos: (typeof YOUTUBE_VIDEOS)[number][];
    direction?: "left" | "right";
    speed?: number;
}) {
    return (
        <div className="relative overflow-hidden group/carousel">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 z-10 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 z-10 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />

            <div
                className="flex gap-5 group-hover/carousel:[animation-play-state:paused]"
                style={{
                    animation: `${direction === "left" ? "yt-scroll-left" : "yt-scroll-right"
                        } ${speed}s linear infinite`,
                    width: "max-content",
                }}
            >
                {/* Duplicate videos for a seamless infinite marquee (no blank gaps) */}
                {[...videos, ...videos].map((video, idx) => (
                    <VideoCard key={`${video.id}-${idx}`} video={video} />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main exported section
// ─────────────────────────────────────────────────────────────────────────────
export default function YouTubeVideoSection() {
    const titleRef = useRef<HTMLDivElement>(null);

    // Fade-in on scroll
    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = "opacity 0.75s ease, transform 0.75s ease";

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* ── Keyframe animations ── */}
            <style>{`
        @keyframes yt-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes yt-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

            <section className="py-12 md:py-16 relative overflow-hidden">
                {/* Subtle background tone */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.45) 50%, transparent 100%)",
                    }}
                />

                {/* Top / bottom hairlines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

                {/* Ambient glow blobs */}
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-blue-600/5" />
                <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-indigo-600/5" />

                {/* ── Section header ── */}
                <div ref={titleRef} className="container mx-auto px-6 mb-12 text-center">
                    {/* YouTube pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-red-500/30 bg-red-500/10">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
                            YouTube Channel
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Learn from Our&nbsp;
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Video Tutorials
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-7">
                        Explore our full library of Arbitrum, Rust &amp; Web3 videos — from beginner
                        walkthroughs to advanced Stylus development.
                    </p>

                    {/* CTA */}
                    <a
                        href="https://www.youtube.com/@xcan_arbitrum/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        View All Videos
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* ── Two carousel rows ── */}
                <div className="space-y-5">
                    {/* Row 1 — 6 videos, scrolls left */}
                    <VideoCarouselRow videos={ROW_1} direction="left" speed={65} />
                    {/* Row 2 — 7 videos, scrolls right */}
                    <VideoCarouselRow videos={ROW_2} direction="right" speed={65} />
                </div>
            </section>
        </>
    );
}

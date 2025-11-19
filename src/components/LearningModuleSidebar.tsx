"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import learningModules, { LearningModule } from "../data/learningModules";

const MODULE_ORDER: string[] = [
  "web3-basics",
  "stylus-core-concepts",
  "stylus-foundation",
  "arbitrum-orbit",
  "arbitrum-stylus",
  "defi-arbitrum",
  "cross-chain",
  "arbitrum-precompiles",
];

const orderedModules: LearningModule[] = MODULE_ORDER.map((id) =>
  learningModules.find((module) => module.id === id)
).filter((module): module is LearningModule => Boolean(module));

interface LearningModuleSidebarProps {
  currentModuleId: string;
  backHref?: string;
  className?: string;
}

const baseSidebarClass =
  "hidden lg:flex flex-shrink-0 border-r border-slate-800 bg-slate-950/70 backdrop-blur transition-[width] duration-300";

const mobileScrollClass =
  "lg:hidden sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur";

export default function LearningModuleSidebar({
  currentModuleId,
  backHref,
  className,
}: LearningModuleSidebarProps) {
  const currentModule = orderedModules.find(
    (module) => module.id === currentModuleId
  );

  const resolvedBackHref =
    backHref || currentModule?.href || "/learn-cross-chain";
  const [isCollapsed, setIsCollapsed] = useState(true);

  const collapsedWidth = "lg:w-14 xl:w-16";
  const expandedWidth = "lg:w-72 xl:w-80";

  return (
    <>
      <div className={`${mobileScrollClass}`}>
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Modules
            </span>
            <span className="text-sm font-medium text-slate-200">
              {currentModule?.title || "Switch module"}
            </span>
          </div>
          <Link
            href={resolvedBackHref}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>
        </div>
        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-3">
            {orderedModules.map((module) => {
              const isActive = module.id === currentModuleId;
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  target={module.target}
                  rel={module.target === "_blank" ? "noreferrer" : undefined}
                  className={`flex min-w-[12rem] flex-1 items-center gap-3 rounded-xl border px-3 py-3 transition ${isActive
                    ? "border-cyan-500/80 bg-cyan-500/10 text-cyan-100"
                    : "border-slate-700/70 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                    }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-cyan-500/20" : "bg-slate-800/80"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-cyan-300" : "text-slate-400"
                        }`}
                    />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">
                      {module.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {module.level}
                    </span>
                  </div>
                  {module.target === "_blank" && (
                    <FiExternalLink className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={`${baseSidebarClass} ${isCollapsed ? collapsedWidth : expandedWidth}${className ? ` ${className}` : ""}`}
        aria-label="Module navigation sidebar"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col">
          <div className="border-b border-slate-800/80 px-3 py-4">
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-2`}>
              <button
                type="button"
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Expand module sidebar" : "Collapse module sidebar"}
              >
                {isCollapsed ? (
                  <FiChevronRight className="h-4 w-4" />
                ) : (
                  <FiChevronLeft className="h-4 w-4" />
                )}
              </button>


            </div>

          </div>

          <div className={`overflow-y-auto ${isCollapsed ? "px-2" : "px-5"} pb-8 pt-6`}>
            <div className="space-y-3 pr-1">
              {orderedModules.map((module) => {
                const isActive = module.id === currentModuleId;
                const Icon = module.icon;
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    target={module.target}
                    rel={
                      module.target === "_blank" ? "noreferrer" : undefined
                    }
                    className={`group flex items-center ${isCollapsed ? "justify-center px-1 py-1" : "gap-4 px-2 py-2"} rounded-xl border transition ${isActive
                      ? "border-cyan-500/70 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900"
                      }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${isActive
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-800/80 text-slate-400 group-hover:text-slate-200"
                        }`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    {!isCollapsed && (
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={`truncate text-sm font-semibold ${isActive ? "text-cyan-100" : "text-slate-100"
                            }`}
                        >
                          {module.title}
                        </span>
                        <span className="mt-1 truncate text-xs text-slate-400">
                          {module.level || "Multi-level"}
                        </span>
                      </div>
                    )}
                    {/* {!isCollapsed && module.target === "_blank" && (
                      <FiExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    )}
                    {isCollapsed && module.target === "_blank" && (
                      <FiExternalLink className="ml-2 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                    )} */}
                    {!isCollapsed && isActive && (
                      <span className="ml-3 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-slate-800/80 pt-5 px-5">
            {isCollapsed ? (
              <Link
                href={resolvedBackHref}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
                aria-label="Back to modules"
              >
                <FiArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={resolvedBackHref}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span>
                  Back to{" "}
                  <span className="hidden xl:inline">
                    {currentModule?.title || "module"}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



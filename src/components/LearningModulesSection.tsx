"use client";

import Link from "next/link";
import Image from "next/image";
import { learningModules, LearningModule } from "../data/learningModules";
import { MODULE_THEME_BG_BR, MODULE_THEME_BG_R } from "@/theme/moduleTheme";

const MODULE_PRICE = 50;
const TOTAL_VALUE = 400;

export default function LearningModulesSection() {
  return (
    <section id="modules" className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Learning Modules</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Comprehensive learning paths covering DeFi fundamentals on Arbitrum
          and advanced Stylus development
        </p>

        {/* Total Value Display */}
        <div className={`mt-6 inline-flex items-center gap-2 px-6 py-3 ${MODULE_THEME_BG_R} rounded-full shadow-lg shadow-[#4A7CFF]/20`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-bold text-xl">Total Value: ${TOTAL_VALUE}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningModules.map((module: LearningModule) => {
          const cardContent = (
            <div className="relative bg-[#12182b] border border-gray-700 rounded-xl overflow-hidden h-full flex flex-col">

              {/* ── Hero image ── */}
              <div className="relative w-full overflow-hidden">
                <Image
                  src={module.image}
                  alt={module.title}
                  width={800}
                  height={450}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />

                {/* Price ribbon — top-right */}
                {module.id !== "project-submission" && module.id !== "arbitrum-stylus" && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative">
                      <div className={`${MODULE_THEME_BG_BR} text-white px-3 py-1.5 rounded-lg shadow-2xl hover:shadow-[#4A7CFF]/50 transition-all duration-300 hover:-translate-y-0.5`}>
                        <div className="text-center">
                          <div className="text-[10px] font-semibold uppercase tracking-wide leading-tight">Worth</div>
                          <div className="text-lg font-bold leading-tight">${MODULE_PRICE}</div>
                        </div>
                      </div>
                      <div className={`absolute inset-0 ${MODULE_THEME_BG_BR} rounded-lg blur-md opacity-60 -z-10`} />
                    </div>
                  </div>
                )}

                {/* Coming soon badge */}
                {module.status === "coming-soon" && (
                  <div className="absolute top-3 left-3 z-10 flex items-center bg-yellow-900 text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Coming Soon
                  </div>
                )}
              </div>

              {/* ── Card body ── */}
              <div className="flex flex-col flex-1 p-6 pt-4">
                {/* Title + level */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  {module.level && (
                    <div className="text-sm text-gray-400 mt-0.5">{module.level}</div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4">{module.description}</p>

                {/* Badges: challenges / sections */}
                {module.duration && module.challenges !== undefined && (
                  <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#12B3A8] bg-[#12B3A8]/20 text-white">
                      {module.challenges} challenges
                    </span>
                    {module.sections !== undefined && module.sections > 0 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#4A7CFF] bg-[#4A7CFF]/20 text-white">
                        {module.sections} sections
                      </span>
                    )}
                  </div>
                )}

                {/* Features */}
                {module.features && module.features.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">
                      {module.title === "Project Submission" ? "What You'll Get:" : "Key Features:"}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {module.features.map((feature, index) => (
                        <div key={index} className="text-xs text-gray-400 flex items-center">
                          <div className="w-1.5 h-1.5 bg-[#79A5FF] rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spacer to push CTA to bottom */}
                <div className="flex-1" />

                {/* CTA button */}
                {module.status === "available" ? (
                  <div
                    className={`block w-full text-center bg-gradient-to-r ${module.gradient} text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300`}
                  >
                    {module.title === "Project Submission" ? "Submit Project" : "Start Learning"}
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-[#1f3064] text-gray-400 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );

          return (
            <div
              key={module.id}
              className={`relative group rounded-xl overflow-hidden ${module.status === "available"
                ? "transform hover:scale-105 transition-all duration-300 cursor-pointer"
                : "opacity-75"
                }`}
            >
              {module.status === "available" ? (
                <Link href={module.href} target={module.target} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

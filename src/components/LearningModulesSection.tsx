import Link from "next/link";
import { learningModules, LearningModule } from "../data/learningModules";

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
        <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-bold text-xl">Total Value: ${TOTAL_VALUE}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningModules.map((module: LearningModule) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={`relative group rounded-xl overflow-hidden ${module.status === "available"
                ? "transform hover:scale-105 transition-all duration-300 cursor-pointer"
                : "opacity-75"
                }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="relative bg-[#12182b] border  border-gray-700 rounded-xl p-6 pt-10 h-full flex flex-col justify-between">
                <div>
                  {/* Price Ribbon - Popping out from top-right corner like camera */}
                  <div className="absolute -top-6 -right-3 z-30">
                    <div className="relative">
                      {/* Ribbon body */}
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="text-center">
                          <div className="text-xs font-semibold uppercase tracking-wide">Worth</div>
                          <div className="text-xl font-bold">${MODULE_PRICE}</div>
                        </div>
                      </div>
                      {/* Shadow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg blur-md opacity-60 -z-10"></div>
                      <div className="absolute -bottom-2 right-3 w-10 h-3 bg-gradient-to-b from-emerald-600/80 to-transparent rounded-t-sm transform -skew-x-6"></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {module.status === "coming-soon" && (
                    <div className="absolute top-4 left-4 flex items-center  bg-yellow-900  text-yellow-200 px-2 py-1 rounded-full text-xs font-medium z-10">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Coming Soon
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${module.gradient} text-white mr-4`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{module.title}</h3>
                      <div className="text-sm  text-gray-400">
                        {module.level}
                      </div>
                    </div>
                  </div>

                  <p className=" text-gray-300 mb-4">{module.description}</p>

                  {module.duration && module.challenges !== undefined && (
                    <div className="flex items-center gap-2 text-sm mb-4">
                      {/* <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-sky-500 bg-sky-900/40 text-white">
                        {module.duration}
                      </span> */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-emerald-500 bg-emerald-900/40 text-white">
                        {module.challenges} challenges
                      </span>
                      {(module.sections !== undefined && module.sections > 0) && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-indigo-500 bg-indigo-900/40 text-white">
                          {module.sections} sections
                        </span>
                      )}
                    </div>
                  )}

                  {module.features && module.features.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-medium mb-2">
                        {module.title === "Project Submission" ? "What You'll Get:" : "Key Features:"}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {module.features.map((feature, index) => (
                          <div
                            key={index}
                            className="text-xs  text-gray-400 flex items-center"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {module.status === "available" ? (
                  <Link
                    href={module.href}
                    target={module.target}
                    className={`block w-full text-center bg-gradient-to-r ${module.gradient} text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300`}
                  >
                    {module.title === "Project Submission" ? "Submit Project" : "Start Learning"}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center  bg-[#1f3064]  text-gray-400 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

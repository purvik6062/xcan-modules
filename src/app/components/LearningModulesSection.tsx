import Link from "next/link";
import { learningModules, LearningModule } from "../data/learningModules";

export default function LearningModulesSection() {
  return (
    <section id="modules" className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Learning Modules</h2>
        <p className="text-xl  text-gray-300 max-w-2xl mx-auto">
          Comprehensive learning paths designed to take you from beginner to
          expert in Arbitrum development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {learningModules.map((module: LearningModule) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={`relative group rounded-xl overflow-hidden ${
                module.status === "available"
                  ? "transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  : "opacity-75"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
              ></div>

              <div className="relative bg-gray-800 border  border-gray-700 rounded-xl p-6 h-full">
                {/* Status Badge */}
                {module.status === "coming-soon" && (
                  <div className="absolute top-4 right-4 flex items-center  bg-yellow-900  text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
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

                <p className=" text-gray-300 mb-4">
                  {module.description}
                </p>

                <div className="flex items-center gap-4 text-sm  text-gray-400 mb-4">
                  <span>{module.duration}</span>
                  <span>•</span>
                  <span>{module.challenges} challenges</span>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-medium mb-2">Key Features:</div>
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

                {module.status === "available" ? (
                  <Link
                    href={module.href}
                    className={`block w-full text-center bg-gradient-to-r ${module.gradient} text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300`}
                  >
                    Start Learning
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center  bg-gray-700  text-gray-400 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
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

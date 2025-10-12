"use client";

import React, { useState } from "react";
import SubmitProjectForm from "@/components/ProjectSubmission/SubmitProjectForm";
import ProjectShowcase from "@/components/ProjectSubmission/ProjectShowcase";

const ProjectSubmissionPage = () => {
  const [activeTab, setActiveTab] = useState<"showcase" | "submit">("showcase");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#4eb991] to-[#31b085] bg-clip-text text-transparent">
            Project Submission
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Built something cool with Stylus? Submit your project to get featured and reviewed by the community.
            <br />
            <span className="text-[#4eb991] font-medium">Highlight your skills, gain visibility, and inspire others in the ecosystem.</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("showcase")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${activeTab === "showcase"
                  ? "bg-gradient-to-r from-[#4eb991] to-[#31b085] text-white shadow-lg shadow-[#4eb992ae]"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Showcase</span>
              </button>
              <button
                onClick={() => setActiveTab("submit")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${activeTab === "submit"
                  ? "bg-gradient-to-r from-[#4eb991] to-[#31b085] text-white shadow-lg shadow-[#4eb992ae]"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Submit Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "showcase" ? (
            <ProjectShowcase />
          ) : (
            <SubmitProjectForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmissionPage;

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/components/ProjectSubmission/types";
import Image from "next/image";
import Link from "next/link";

const ProjectDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.projectId) {
      fetchProject(params.projectId as string);
    }
  }, [params.projectId]);

  const fetchProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/project-submission/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        console.error("Failed to fetch project");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500"></div>
          <p className="text-slate-400 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-6">Project Not Found</h1>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-3 text-slate-300 hover:text-white mb-8 transition-colors group"
        >
          <div className="p-2 rounded-lg group-hover:bg-slate-700/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-medium">Back to Showcase</span>
        </button>

        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 mb-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Project Logo/Image */}
              <div className="flex-shrink-0">
                {project.projectLogo ? (
                  <Image
                    src={project.projectLogo}
                    alt={project.projectName}
                    width={160}
                    height={160}
                    className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                    loading="eager"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#4eb991] to-[#31b085] bg-clip-text text-transparent">
                  {project.projectName}
                </h1>
                <p className="text-slate-300 text-xl mb-8 leading-relaxed">
                  {project.projectDescription}
                </p>

                {/* Submitted By */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {project.submittedBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{project.submittedBy.name}</p>
                    <p className="text-slate-400 text-sm">
                      {project.submittedBy.address.slice(0, 6)}...{project.submittedBy.address.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={project.githubRepository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl border border-slate-600/50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>View on GitHub</span>
                  </Link>

                  {project.hostedProjectUrl && (
                    <Link
                      href={project.hostedProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Visit Project</span>
                    </Link>
                  )}

                  {project.demoVideoLink && (
                    <Link
                      href={project.demoVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>Watch Demo</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Images */}
          {project.projectImages && project.projectImages.length > 0 && (
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 mb-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Project Images</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.projectImages.map((image, index) => (
                  <div key={index} className="aspect-video bg-slate-700/50 rounded-2xl overflow-hidden shadow-lg group">
                    <Image
                      width={800}
                      height={450}
                      src={image}
                      alt={`${project.projectName} - Image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 mb-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Team Members</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.teamMembers.map((member, index) => (
                  <div key={index} className="bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-lg truncate">{member.name}</p>
                        <p className="text-slate-400 text-sm truncate">
                          {member.address.slice(0, 6)}...{member.address.slice(-4)}
                        </p>
                        <a
                          href={`https://github.com/${member.githubId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          @{member.githubId}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

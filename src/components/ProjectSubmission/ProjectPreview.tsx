"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { TeamMember } from "./types";

interface PreviewProjectData {
  projectName: string;
  projectDescription: string;
  submittedBy: {
    name: string;
    address: string;
    githubId: string;
  };
  teamMembers: TeamMember[];
  githubRepository: string;
  hostedProjectUrl: string;
  projectImages: File[];
  projectLogo: File | null;
  demoVideoLink: string;
}

interface ProjectPreviewProps {
  project: PreviewProjectData;
  onClose: () => void;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onClose }) => {
  const getImageUrl = (file: File | null): string => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Project Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Project Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Project Logo */}
            <div className="flex-shrink-0">
              {project.projectLogo ? (
                <img
                  src={getImageUrl(project.projectLogo)}
                  alt={project.projectName}
                  className="w-40 h-40 rounded-2xl object-cover shadow-lg"
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4eb991] to-[#31b085] bg-clip-text text-transparent">
                {project.projectName}
              </h1>
              
              {/* Description with Markdown */}
              <div className="prose prose-invert prose-lg max-w-none mb-6 text-slate-300 leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0 text-lg">{children}</p>,
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-3 mt-5 first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-2 mt-4 first:mt-0">{children}</h3>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="bg-slate-700/50 px-2 py-1 rounded text-base text-blue-300 font-mono">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto my-4 border border-slate-700/50">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-slate-300">{children}</li>,
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-slate-400">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {project.projectDescription}
                </ReactMarkdown>
              </div>

              {/* Submitted By */}
              <div className="flex items-center space-x-4 mb-6">
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
                  <a
                    href={`https://github.com/${project.submittedBy.githubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    @{project.submittedBy.githubId}
                  </a>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={project.githubRepository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl border border-slate-600/50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>View on GitHub</span>
                </a>

                {project.hostedProjectUrl && (
                  <a
                    href={project.hostedProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Visit Project</span>
                  </a>
                )}

                {project.demoVideoLink && (
                  <a
                    href={project.demoVideoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Watch Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Project Images */}
          {project.projectImages && project.projectImages.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Project Images</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from(project.projectImages).map((file, index) => (
                  <div key={index} className="aspect-video bg-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getImageUrl(file)}
                      alt={`${project.projectName} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Team Members</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.teamMembers.map((member, index) => (
                  <div key={index} className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{member.name}</p>
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;


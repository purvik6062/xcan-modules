"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Project } from "./types";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project-submission/${project._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#4EB991]-500/10 group"
    >
      {/* Cover Image */}
      <div className="aspect-video bg-slate-700/50 rounded-xl mb-6 overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.projectImages[0]}
            alt={project.projectName}
            width={100}
            height={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {project.projectName}
        </h3>

        <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
          {project.projectDescription}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">
                {project.submittedBy.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-slate-300 text-sm font-medium">
              {project.submittedBy.name}
            </span>
          </div>

          <div className="text-blue-400 group-hover:text-blue-300 transition-colors p-2 group-hover:bg-blue-500/10 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

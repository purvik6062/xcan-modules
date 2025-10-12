"use client";

import React, { useState } from "react";

interface ProjectFiltersProps {
  onSearch: (query: string) => void;
  projectsPerPage: number;
  onProjectsPerPageChange: (perPage: number) => void;
  totalProjects: number;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onSearch,
  projectsPerPage,
  onProjectsPerPageChange,
  totalProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Results count and per page selector */}
        <div className="flex items-center space-x-6">
          <span className="text-slate-300 text-sm font-medium">
            {totalProjects} project{totalProjects !== 1 ? 's' : ''} found
          </span>

          <div className="flex items-center space-x-3">
            <label className="text-slate-300 text-sm font-medium">Show:</label>
            <select
              value={projectsPerPage}
              onChange={(e) => onProjectsPerPageChange(Number(e.target.value))}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-300 text-sm font-medium">per page</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;

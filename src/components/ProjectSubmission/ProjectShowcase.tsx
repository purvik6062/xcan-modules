"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import { Project } from "./types";

const ProjectShowcase = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/project-submission");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProjectsPerPageChange = (perPage: number) => {
    setProjectsPerPage(perPage);
    setCurrentPage(1); // Reset to first page
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500"></div>
          <p className="text-slate-400 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProjectFilters
        onSearch={handleSearch}
        projectsPerPage={projectsPerPage}
        onProjectsPerPageChange={handleProjectsPerPageChange}
        totalProjects={filteredProjects.length}
      />

      {/* Projects Grid */}
      {currentProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-700/50 rounded-2xl mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {searchQuery ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-slate-400 text-lg">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Be the first to submit a project!"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcase;

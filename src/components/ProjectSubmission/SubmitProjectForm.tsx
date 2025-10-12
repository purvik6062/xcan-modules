"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface TeamMember {
  name: string;
  address: string;
  githubId: string;
}

interface ProjectSubmissionData {
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

const SubmitProjectForm = () => {
  const { user } = usePrivy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectSubmissionData>({
    projectName: "",
    projectDescription: "",
    submittedBy: {
      name: user?.email?.address || "",
      address: "",
      githubId: "",
    },
    teamMembers: [],
    githubRepository: "",
    hostedProjectUrl: "",
    projectImages: [],
    projectLogo: null,
    demoVideoLink: "",
  });

  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: "",
    address: "",
    githubId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("submittedBy.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        submittedBy: {
          ...prev.submittedBy,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (files) {
      if (field === "projectImages") {
        setFormData(prev => ({
          ...prev,
          projectImages: Array.from(files),
        }));
      } else if (field === "projectLogo") {
        setFormData(prev => ({
          ...prev,
          projectLogo: files[0] || null,
        }));
      }
    }
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.address && newTeamMember.githubId) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember],
      }));
      setNewTeamMember({ name: "", address: "", githubId: "" });
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Client-side validation
      if (
        !formData.projectName ||
        !formData.projectDescription ||
        !formData.submittedBy.name ||
        !formData.submittedBy.address ||
        !formData.submittedBy.githubId ||
        !formData.githubRepository ||
        !formData.demoVideoLink
      ) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (formData.projectImages.length < 2) {
        setError("Please upload at least 2 project images");
        setIsSubmitting(false);
        return;
      }

      if (!formData.projectLogo) {
        setError("Please upload a project logo");
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("projectName", formData.projectName);
      formDataToSend.append("projectDescription", formData.projectDescription);
      formDataToSend.append("submittedBy", JSON.stringify(formData.submittedBy));
      formDataToSend.append("teamMembers", JSON.stringify(formData.teamMembers));
      formDataToSend.append("githubRepository", formData.githubRepository);
      formDataToSend.append("hostedProjectUrl", formData.hostedProjectUrl);
      formDataToSend.append("demoVideoLink", formData.demoVideoLink);

      // Append image files
      formData.projectImages.forEach((file, index) => {
        formDataToSend.append(`projectImages`, file);
      });

      if (formData.projectLogo) {
        formDataToSend.append("projectLogo", formData.projectLogo);
      }

      const response = await fetch("/api/project-submission", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          projectName: "",
          projectDescription: "",
          submittedBy: {
            name: user?.email?.address || "",
            address: "",
            githubId: "",
          },
          teamMembers: [],
          githubRepository: "",
          hostedProjectUrl: "",
          projectImages: [],
          projectLogo: null,
          demoVideoLink: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setError(error instanceof Error ? error.message : "Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Project Submitted Successfully!</h3>
        <p className="text-slate-300 mb-8 text-lg">
          Your project has been submitted for review. It will appear in the showcase once approved.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Submit Another Project
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50 shadow-2xl">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">Submit Your Project</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Project Name *
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your project name"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Project Description *
          </label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Describe your project, its features, and what makes it unique"
          />
        </div>

        {/* Submitted By */}
        <div className="bg-slate-700/40 rounded-2xl p-8 border border-slate-600/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Submitted By</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Name *
              </label>
              <input
                type="text"
                name="submittedBy.name"
                value={formData.submittedBy.name}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Wallet Address *
              </label>
              <input
                type="text"
                name="submittedBy.address"
                value={formData.submittedBy.address}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                GitHub ID *
              </label>
              <input
                type="text"
                name="submittedBy.githubId"
                value={formData.submittedBy.githubId}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Your GitHub username"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-slate-700/40 rounded-2xl p-8 border border-slate-600/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-[#4eb991] to-[#31b085] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Team Members</h3>
          </div>

          {/* Add Team Member */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={newTeamMember.name}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
              className="px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Address"
              value={newTeamMember.address}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, address: e.target.value }))}
              className="px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="GitHub ID"
              value={newTeamMember.githubId}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, githubId: e.target.value }))}
              className="px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={addTeamMember}
              className="bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add Member
            </button>
          </div>

          {/* Team Members List */}
          {formData.teamMembers.length > 0 && (
            <div className="space-y-3">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-600/40 rounded-xl p-4 border border-slate-600/30">
                  <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                    <span className="text-white font-medium">{member.name}</span>
                    <span className="text-slate-300 truncate">{member.address}</span>
                    <span className="text-slate-300">{member.githubId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-400 hover:text-red-300 ml-4 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GitHub Repository */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            GitHub Repository Link *
          </label>
          <input
            type="url"
            name="githubRepository"
            value={formData.githubRepository}
            onChange={handleInputChange}
            required
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="https://github.com/username/repository"
          />
        </div>

        {/* Project Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Project Images * (2 images required)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "projectImages")}
            required
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#4eb991] file:to-[#31b085] file:text-white hover:file:from-teal-600 hover:file:to-teal-700 transition-all duration-200"
          />
          <p className="text-sm text-slate-400 mt-3">
            Upload 2 images showcasing your project
          </p>
        </div>

        {/* Project Logo */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Project Logo *
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleFileChange(e, "projectLogo")}
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#4eb991] file:to-[#31b085] file:text-white hover:file:from-teal-600 hover:file:to-teal-700 transition-all duration-200"
          />
        </div>

        {/* Demo Video Link */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Demo Video Link *
          </label>
          <input
            type="url"
            name="demoVideoLink"
            required
            value={formData.demoVideoLink}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="https://youtube.com/... or https://vimeo.com/..."
          />
        </div>

        {/* Hosted Project URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Hosted Project URL
          </label>
          <input
            type="url"
            name="hostedProjectUrl"
            value={formData.hostedProjectUrl}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="https://your-project.com"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#4eb991] to-[#31b085] hover:from-teal-600 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Project"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitProjectForm;

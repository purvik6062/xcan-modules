export interface Project {
  _id: string; // This will be the UUID (projectId) for external use
  projectId: string; // UUID for the project
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
  projectImages: string[]; // IPFS URLs
  projectLogo: string; // IPFS URL
  demoVideoLink: string;
  coverImage?: string; // First project image
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  name: string;
  address: string;
  githubId: string;
}

export interface ProjectSubmissionData {
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
  projectLogo: File; // Required field
  demoVideoLink: string; // Required field
}

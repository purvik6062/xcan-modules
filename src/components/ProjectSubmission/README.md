# Project Submission Feature

This directory contains all components and functionality for the Project Submission feature, which allows users to submit their Stylus projects for community showcase and review.

## Components

### SubmitProjectForm.tsx

- Handles project submission with all required fields
- Includes form validation and file upload handling
- Supports team member management
- Integrates with Privy for user authentication

### ProjectShowcase.tsx

- Displays all submitted projects in a grid layout
- Implements pagination (15, 30, 50 projects per page)
- Includes search functionality
- Handles loading states and empty states

### ProjectCard.tsx

- Individual project card component
- Shows project cover image, name, description, and submitter
- Clickable to navigate to project details page
- Hover effects and responsive design

### ProjectFilters.tsx

- Search input for filtering projects by name
- Projects per page selector
- Results count display
- Responsive layout

### types.ts

- TypeScript interfaces for Project, TeamMember, and ProjectSubmissionData
- Ensures type safety across all components

## API Routes

### /api/project-submission

- **GET**: Fetches all projects for showcase view
- **POST**: Creates new project submission

### /api/project-submission/[projectId]

- **GET**: Fetches specific project details

### File Upload

- Images and logos are uploaded directly to Pinata IPFS
- IPFS URLs are stored in the database
- No separate upload API routes needed

## Database Schema

The project submissions are stored in MongoDB with the following structure:

```typescript
{
  _id: ObjectId; // MongoDB ObjectId for internal use
  projectId: string; // UUID for external use and routing
  projectName: string;
  projectDescription: string;
  submittedBy: {
    name: string;
    address: string;
    githubId: string;
  };
  teamMembers: Array<{
    name: string;
    address: string;
    githubId: string;
  }>;
  githubRepository: string;
  hostedProjectUrl: string;
  projectImages: string[]; // IPFS URLs from Pinata
  projectLogo: string; // IPFS URL from Pinata
  demoVideoLink: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
```

## ID System

- **MongoDB ObjectId**: Used internally for database operations
- **UUID (projectId)**: Used for external API calls and routing
- **URL Structure**: `/project-submission/[projectId]` where `projectId` is a UUID

## Features

- ✅ Project submission form with all required fields
- ✅ Pinata IPFS upload for images and logos
- ✅ Team member management
- ✅ Project showcase with pagination
- ✅ Search functionality
- ✅ Project details page
- ✅ Responsive design
- ✅ Modern UI with smooth animations
- ✅ TypeScript support
- ✅ MongoDB integration with UUID support

## Usage

1. Navigate to `/project-submission`
2. Switch between "Showcase" and "Submit Project" tabs
3. Submit projects using the form
4. View and search projects in the showcase
5. Click on project cards to view detailed information

## Future Enhancements

- Project approval workflow
- User ratings and reviews
- Project categories and tags
- Advanced filtering options
- Project statistics and analytics

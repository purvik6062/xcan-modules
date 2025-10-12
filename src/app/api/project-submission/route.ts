import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const projects = await db
      .collection("project-submissions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform the data to include cover image (first project image) and use projectId
    const transformedProjects = projects.map((project) => ({
      ...project,
      _id: project.projectId, // Use projectId instead of MongoDB ObjectId
      coverImage:
        project.projectImages && project.projectImages.length > 0
          ? project.projectImages[0]
          : null,
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const formData = await request.formData();

    // Extract form data
    const projectName = formData.get("projectName") as string;
    const projectDescription = formData.get("projectDescription") as string;
    const submittedBy = JSON.parse(formData.get("submittedBy") as string);
    const teamMembers = JSON.parse(formData.get("teamMembers") as string);
    const githubRepository = formData.get("githubRepository") as string;
    const hostedProjectUrl = formData.get("hostedProjectUrl") as string;
    const demoVideoLink = formData.get("demoVideoLink") as string;

    // Helper function to upload file to Pinata
    const uploadFileToPinata = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({
        name: file.name,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", pinataOptions);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      return await response.json();
    };

    // Handle file uploads to Pinata
    const projectImages: string[] = [];
    const projectImagesFiles = formData.getAll("projectImages") as File[];

    for (const file of projectImagesFiles) {
      if (file && file.size > 0) {
        try {
          const pinataResponse = await uploadFileToPinata(file);
          const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`;
          projectImages.push(ipfsUrl);
        } catch (error) {
          console.error("Error uploading project image to Pinata:", error);
          throw new Error(`Failed to upload project image: ${file.name}`);
        }
      }
    }

    let projectLogo: string | undefined;
    const projectLogoFile = formData.get("projectLogo") as File;
    if (projectLogoFile && projectLogoFile.size > 0) {
      try {
        const pinataResponse = await uploadFileToPinata(projectLogoFile);
        projectLogo = `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`;
      } catch (error) {
        console.error("Error uploading project logo to Pinata:", error);
        throw new Error(
          `Failed to upload project logo: ${projectLogoFile.name}`
        );
      }
    }

    // Validate required fields
    if (
      !projectName ||
      !projectDescription ||
      !submittedBy.name ||
      !submittedBy.address ||
      !submittedBy.githubId ||
      !githubRepository ||
      !demoVideoLink
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate project images
    if (projectImages.length < 2) {
      return NextResponse.json(
        { error: "At least 2 project images are required" },
        { status: 400 }
      );
    }

    // Validate project logo
    if (!projectLogo) {
      return NextResponse.json(
        { error: "Project logo is required" },
        { status: 400 }
      );
    }

    // Generate UUID for the project
    const projectId = uuidv4();

    // Create project submission document
    const projectSubmission = {
      _id: new ObjectId(), // Keep MongoDB ObjectId for internal use
      projectId, // Add UUID for external use
      projectName,
      projectDescription,
      submittedBy,
      teamMembers,
      githubRepository,
      hostedProjectUrl: hostedProjectUrl || null,
      projectImages,
      projectLogo,
      demoVideoLink,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("project-submissions")
      .insertOne(projectSubmission);

    return NextResponse.json(
      {
        message: "Project submitted successfully",
        projectId: projectId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json(
      { error: "Failed to submit project" },
      { status: 500 }
    );
  }
}

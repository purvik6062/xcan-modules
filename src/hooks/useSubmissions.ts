import { useQuery } from "@tanstack/react-query";

interface FoundationSubmission {
  walletAddress: string;
  githubRepo?: string;
  contractAddress?: string;
  moduleId: "stylus-foundation";
  type: "foundation";
  transactionHash?: string;
}

interface AdvocateSubmission {
  walletAddress: string;
  moduleId: "xcan-advocate";
  type: "advocate";
  isEligible?: boolean;
  transactionHash?: string;
  certificationLevel?: string;
  certificationLevelName?: string;
}

interface ModuleSubmission {
  walletAddress: string;
  moduleId: string;
  moduleName: string;
  isCompleted: boolean;
  type: "module";
  transactionHash?: string;
  completedChaptersCount?: number;
  totalPoints?: number;
  certificationLevel?: string;
  certificationLevelName?: string;
  updatedAt?: string;
  githubRepo?: string;
  contractAddress?: string;
  // New fields for Arbitrum Stylus
  completedChallenges?: string[];
  nftTransactionHashes?: Array<{
    transactionHash: string;
    levelName?: string;
    level?: number;
    mintedAt?: Date;
  }>;
}

type Submission = FoundationSubmission | AdvocateSubmission | ModuleSubmission;

interface UserModuleCount {
  walletAddress: string;
  moduleCount: number;
  modules: string[];
}

interface ModuleUserCount {
  moduleId: string;
  moduleName: string;
  userCount: number;
}

export interface SubmissionsData {
  submissions: Submission[];
  submissionsByModule: Record<string, Submission[]>;
  totalSubmissions: number;
  uniqueUsers: number;
  userModuleCounts: UserModuleCount[];
  moduleUserCounts: ModuleUserCount[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: {
    totalFoundationSubmissions: number;
    totalAdvocatesSubmissions: number;
    totalModuleSubmissions: number;
    totalArbitrumStylusSubmissions: number;
    totalNFTsMinted: number;
    nftBreakdown: {
      mintedNFTCollection: number;
      foundationUsers: number;
      advocates: number;
      userModules: number;
    };
    nftClaimRate: number;
    completionRate: number;
    mostActiveModule: string;
  };
}

interface UseSubmissionsParams {
  module?: string | null;
  page?: number;
  enabled?: boolean;
}

export function useSubmissions({
  module = null,
  page = 1,
  enabled = true,
}: UseSubmissionsParams = {}) {
  return useQuery<SubmissionsData>({
    queryKey: ["submissions", module, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (module && module !== "all") {
        params.append("module", module);
      }
      params.append("page", page.toString());

      const response = await fetch(`/api/submissions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch submissions data");
      }

      return response.json();
    },
    enabled,
    staleTime: 60 * 1000, // 1 minute - data is cached on server for 60s
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh
  });
}

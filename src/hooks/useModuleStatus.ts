"use client";

import { useState, useEffect } from "react";
import { nftModules, NFTModule } from "@/data/nftModules";

interface ModuleStatus {
  isCompleted: boolean;
  isClaimed: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseModuleStatusReturn {
  moduleStatuses: Record<string, ModuleStatus>;
  claimModule: (moduleId: string) => Promise<void>;
  isClaiming: string | null;
}

export function useModuleStatus(
  userAddress: string | null
): UseModuleStatusReturn {
  const [moduleStatuses, setModuleStatuses] = useState<
    Record<string, ModuleStatus>
  >({});
  const [isClaiming, setIsClaiming] = useState<string | null>(null);

  // Initialize module statuses
  useEffect(() => {
    const initialStatuses: Record<string, ModuleStatus> = {};
    nftModules.forEach((module) => {
      initialStatuses[module.id] = {
        isCompleted: false,
        isClaimed: false,
        isLoading: true,
        error: null,
      };
    });
    setModuleStatuses(initialStatuses);
  }, []);

  // Check module completion and claim status
  useEffect(() => {
    if (!userAddress) {
      // Reset all statuses when no user address
      const resetStatuses: Record<string, ModuleStatus> = {};
      nftModules.forEach((module) => {
        resetStatuses[module.id] = {
          isCompleted: false,
          isClaimed: false,
          isLoading: false,
          error: null,
        };
      });
      setModuleStatuses(resetStatuses);
      return;
    }

    const checkModuleStatuses = async () => {
      for (const currentModule of nftModules) {
        try {
          if (currentModule.database === "postgres") {
            // For Arbitrum Stylus (Postgres), we'll handle this separately
            setModuleStatuses((prev) => ({
              ...prev,
              [currentModule.id]: {
                isCompleted: true, // Assume completed for now
                isClaimed: false,
                isLoading: false,
                error: null,
              },
            }));
            continue;
          }

          // For MongoDB modules, check completion and claim status
          const [completionResponse, claimResponse] = await Promise.all([
            // Check if module is completed
            fetch(
              `/api/challenges?userAddress=${userAddress}&module=${currentModule.id}`
            ),
            // Check if NFT is already claimed
            fetch(
              `/api/certification/claim/${currentModule.id}?userAddress=${userAddress}`
            ),
          ]);

          const completionData = await completionResponse.json();
          const claimData = await claimResponse.json();

          const isCompleted = completionData?.isCompleted || false;
          const isClaimed = claimData?.claimed || false;

          setModuleStatuses((prev) => ({
            ...prev,
            [currentModule.id]: {
              isCompleted,
              isClaimed,
              isLoading: false,
              error: null,
            },
          }));
        } catch (error) {
          console.error(
            `Error checking status for module ${currentModule.id}:`,
            error
          );
          setModuleStatuses((prev) => ({
            ...prev,
            [currentModule.id]: {
              isCompleted: false,
              isClaimed: false,
              isLoading: false,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          }));
        }
      }
    };

    checkModuleStatuses();
  }, [userAddress]);

  const claimModule = async (moduleId: string) => {
    if (!userAddress) return;

    const currentModule = nftModules.find((m) => m.id === moduleId);
    if (!currentModule || currentModule.database === "postgres") return;

    setIsClaiming(moduleId);

    try {
      // This would typically involve minting an NFT
      // For now, we'll just mark it as claimed in the database
      const response = await fetch(`/api/certification/claim/${moduleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress,
          // Add other required fields for NFT minting
          transactionHash: "mock-tx-hash", // This would be real in production
          metadataUrl: "mock-metadata-url",
          imageUrl: "mock-image-url",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to claim NFT");
      }

      // Update local state
      setModuleStatuses((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          isClaimed: true,
        },
      }));
    } catch (error) {
      console.error(`Error claiming module ${moduleId}:`, error);
      setModuleStatuses((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setIsClaiming(null);
    }
  };

  return {
    moduleStatuses,
    claimModule,
    isClaiming,
  };
}

import { ReactNode } from "react";
import ChallengeNavigation from "../../components/ChallengeNavigation";

export default function ChallengeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070d1b] to-[#102247] text-white flex flex-col">
        {/* <ChallengeNavigation /> */}
        <div className="flex-1">{children}</div>
        {/* Footer is intentionally removed */}
    </div>
  );
}
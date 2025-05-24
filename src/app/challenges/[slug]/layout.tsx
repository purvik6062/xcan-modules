import { ReactNode } from "react";

export default function ChallengeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070d1b] to-[#102247] text-white">
      {children}
    </div>
  );
}
import { ReactNode } from "react";

export default function ChallengeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#070d1b] to-[#102247] text-white">
      {/* <ChallengeNavigation /> */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      {/* Footer is intentionally removed */}
    </div>
  );
}
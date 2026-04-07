export default function ChallengeSlugLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#070d1b] to-[#102247] px-4 text-white">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" aria-hidden />
      <p className="text-sm font-medium text-blue-100">Loading challenge…</p>
      <p className="max-w-xs text-center text-xs text-gray-400">Fetching workspace and tools</p>
    </div>
  );
}

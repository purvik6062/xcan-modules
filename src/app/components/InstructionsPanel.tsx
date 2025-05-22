"use client";

interface InstructionsPanelProps {
  instructions: string;
}

export default function InstructionsPanel({
  instructions,
}: InstructionsPanelProps) {
  // Format markdown-style instructions to HTML
  const formatInstructions = (instructions: string) => {
    return instructions
      .replace(
        /^#{1,6}\s+(.*)$/gm,
        '<h3 class="font-bold text-xl mb-2">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /```(?:js|javascript)\n([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded my-3 overflow-x-auto"><code>$1</code></pre>'
      )
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>'
      )
      .replace(/\n\n/g, "<br/><br/>");
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div
        dangerouslySetInnerHTML={{
          __html: formatInstructions(instructions),
        }}
      />
    </div>
  );
}

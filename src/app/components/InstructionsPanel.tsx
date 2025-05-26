"use client";

import React from "react";
import { FiCheckCircle, FiCode, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { GoLightBulb, GoChecklist, GoNumber } from "react-icons/go";

interface InstructionsPanelProps {
  instructions: string;
}

export default function InstructionsPanel({
  instructions,
}: InstructionsPanelProps) {
  // Process the instructions to create a structured format
  const processInstructions = (rawInstructions: string) => {
    // Trim whitespace and normalize line endings
    const normalizedInstructions = rawInstructions
      .trim()
      .replace(/\r\n/g, "\n");

    // Split into sections based on headings
    const sections: Array<{ type: string; content: string; level?: number }> =
      [];
    let currentSection: {
      type: string;
      content: string;
      level?: number;
    } | null = null;

    // Process line by line
    const lines = normalizedInstructions.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if this is a heading
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        // If we have a current section, push it before starting a new one
        if (currentSection) {
          sections.push(currentSection);
        }

        currentSection = {
          type: "heading",
          content: headingMatch[2],
          level: headingMatch[1].length,
        };

        // Push immediately and set to null to start collecting content
        sections.push(currentSection);
        currentSection = null;
        continue;
      }

      // Check if this is a numbered list item
      const numberedListMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numberedListMatch) {
        if (currentSection && currentSection.type !== "numbered-list") {
          sections.push(currentSection);
          currentSection = null;
        }

        const listItem = {
          number: parseInt(numberedListMatch[1]),
          content: numberedListMatch[2],
        };

        if (!currentSection) {
          currentSection = {
            type: "numbered-list",
            content: JSON.stringify([listItem]),
          };
        } else {
          // Parse existing list, add new item, and stringify back
          const list = JSON.parse(currentSection.content);
          list.push(listItem);
          currentSection.content = JSON.stringify(list);
        }
        continue;
      }

      // Check if this is a bullet list item
      const bulletListMatch = line.match(/^[-*]\s+(.*)$/);
      if (bulletListMatch) {
        if (currentSection && currentSection.type !== "bullet-list") {
          sections.push(currentSection);
          currentSection = null;
        }

        const listItem = bulletListMatch[1];

        if (!currentSection) {
          currentSection = {
            type: "bullet-list",
            content: JSON.stringify([listItem]),
          };
        } else {
          // Parse existing list, add new item, and stringify back
          const list = JSON.parse(currentSection.content);
          list.push(listItem);
          currentSection.content = JSON.stringify(list);
        }
        continue;
      }

      // Check if this is the start of a code block
      if (line.startsWith("```")) {
        // If we have a current section, push it before starting the code block
        if (currentSection) {
          sections.push(currentSection);
          currentSection = null;
        }

        // Collect all lines until the closing ```
        let codeContent = "";
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith("```")) {
          codeContent += lines[j] + "\n";
          j++;
        }

        // Create a code block section
        sections.push({
          type: "code-block",
          content: codeContent,
        });

        // Skip ahead to after the closing ```
        i = j;
        continue;
      }

      // Handle empty lines - they separate paragraphs
      if (line === "") {
        if (currentSection) {
          sections.push(currentSection);
          currentSection = null;
        }
        continue;
      }

      // Regular paragraph text
      if (!currentSection) {
        currentSection = {
          type: "paragraph",
          content: line,
        };
      } else if (currentSection.type === "paragraph") {
        // Append to existing paragraph
        currentSection.content += " " + line;
      } else {
        // Different type, push current and start new paragraph
        sections.push(currentSection);
        currentSection = {
          type: "paragraph",
          content: line,
        };
      }
    }

    // Don't forget the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  // Format text with markdown-style formatting
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-400'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='text-blue-300'>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-[#152241] px-2 py-0.5 rounded text-blue-300 font-mono text-sm">$1</code>'
      );
  };

  const sections = processInstructions(instructions);

  return (
    <div className="text-gray-300 space-y-4">
      {sections.map((section, index) => {
        // Render headings
        if (section.type === "heading") {
          return (
            <div key={`heading-${index}`} className="mb-4">
              {section.level === 1 ? (
                <h1 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
                  <FiInfo className="mr-2 text-blue-400" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatText(section.content),
                    }}
                  />
                </h1>
              ) : (
                <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                  <GoLightBulb className="mr-2 text-yellow-400" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatText(section.content),
                    }}
                  />
                </h3>
              )}
              <div className="h-1 w-24 bg-blue-700 rounded-full mt-1"></div>
            </div>
          );
        }

        // Render numbered lists
        if (section.type === "numbered-list") {
          const items = JSON.parse(section.content);
          return (
            <div key={`numbered-list-${index}`} className="my-4 space-y-3">
              {items.map(
                (
                  item: { number: number; content: string },
                  itemIndex: number
                ) => (
                  <div
                    key={`num-item-${itemIndex}`}
                    className="flex items-center bg-[#0f1d3a]/50 p-3 rounded-lg border border-[#1d315e]/50"
                  >
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-semibold">
                        {item.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: formatText(item.content),
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          );
        }

        // Render bullet lists
        if (section.type === "bullet-list") {
          const items = JSON.parse(section.content);
          return (
            <div key={`bullet-list-${index}`} className="my-4 space-y-2">
              {items.map((item: string, itemIndex: number) => (
                <div
                  key={`bullet-item-${itemIndex}`}
                  className="flex items-start"
                >
                  <div className="text-green-400 mr-2 mt-1 flex-shrink-0">
                    <FiCheckCircle />
                  </div>
                  <div
                    className="flex-1"
                    dangerouslySetInnerHTML={{ __html: formatText(item) }}
                  />
                </div>
              ))}
            </div>
          );
        }

        // Render code blocks
        if (section.type === "code-block") {
          return (
            <div key={`code-${index}`} className="relative my-4">
              <div className="absolute top-0 right-0 bg-black text-xs text-green-400 px-2 py-1 rounded-bl font-mono">
                JavaScript
              </div>
              <pre className="bg-[#0f1d3a] p-4 pt-6 rounded-md overflow-x-auto border border-[#1d315e] font-mono text-sm text-blue-300">
                <code>{section.content}</code>
              </pre>
            </div>
          );
        }

        // Render paragraphs with special handling for notes
        if (section.type === "paragraph") {
          // Detect if paragraph might be an important note
          if (
            section.content.toLowerCase().includes("note:") ||
            section.content.toLowerCase().includes("important:") ||
            section.content.toLowerCase().includes("remember:")
          ) {
            return (
              <div
                key={`note-${index}`}
                className="bg-[#1d315e]/40 border border-[#2a407a] rounded-md p-3 my-3 flex items-start"
              >
                <FiAlertTriangle className="text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                <div
                  className="flex-1 text-yellow-200"
                  dangerouslySetInnerHTML={{
                    __html: formatText(section.content),
                  }}
                />
              </div>
            );
          }

          return (
            <p
              key={`para-${index}`}
              className="my-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(section.content) }}
            />
          );
        }

        // Fallback for any unhandled section types
        return <div key={`unknown-${index}`}>{section.content}</div>;
      })}

      <div className="mt-6 pt-4 border-t border-[#1d315e]">
        <div className="flex items-center text-blue-200 font-normal">
          <GoChecklist className="mr-2" />
          <span>Complete all the steps above to solve the challenge!</span>
        </div>
      </div>
    </div>
  );
}

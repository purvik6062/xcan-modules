import Link from "next/link";

interface ChallengeCardProps {
  id: number;
  title: string;
  level: string;
  description: string;
  slug: string;
  category: string;
  points: number;
  precompileUsed: string;
}

export default function ChallengeCard({
  id,
  title,
  level,
  description,
  slug,
  category,
  points,
  precompileUsed,
}: ChallengeCardProps) {
  const getLevelStyle = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-900 text-green-200";
      case "Intermediate":
        return "bg-yellow-900 text-yellow-200";
      case "Advanced":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  return (
    <Link
      href={`/challenges/${slug}`}
      className="block border  border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow  hover:border-blue-600"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${getLevelStyle(level)}`}>
          {level}
        </span>
      </div>
      <p className="text-sm  text-gray-300 mb-3">
        {description}
      </p>
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-2">
          <span className=" bg-gray-700 rounded px-2 py-1">
            {category}
          </span>
          <span className=" bg-blue-900  text-blue-200 rounded px-2 py-1">
            {precompileUsed}
          </span>
        </div>
        <span className="font-semibold">{points} points</span>
      </div>
    </Link>
  );
}

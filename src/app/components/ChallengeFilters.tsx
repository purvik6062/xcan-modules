import { useState } from "react";

interface FiltersProps {
  categories: string[];
  precompiles: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  levels: {
    Beginner: boolean;
    Intermediate: boolean;
    Advanced: boolean;
  };
  categories: Record<string, boolean>;
  precompiles: Record<string, boolean>;
}

export default function ChallengeFilters({
  categories,
  precompiles,
  onFilterChange,
}: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    levels: {
      Beginner: true,
      Intermediate: true,
      Advanced: true,
    },
    categories: categories.reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {} as Record<string, boolean>),
    precompiles: precompiles.reduce((acc, precompile) => {
      acc[precompile] = true;
      return acc;
    }, {} as Record<string, boolean>),
  });

  const handleLevelChange = (level: keyof FilterState["levels"]) => {
    const newFilters = {
      ...filters,
      levels: {
        ...filters.levels,
        [level]: !filters.levels[level],
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = {
      ...filters,
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category],
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePrecompileChange = (precompile: string) => {
    const newFilters = {
      ...filters,
      precompiles: {
        ...filters.precompiles,
        [precompile]: !filters.precompiles[precompile],
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Difficulty</h3>
        <div className="space-y-2">
          {Object.keys(filters.levels).map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.levels[level as keyof FilterState["levels"]]}
                onChange={() =>
                  handleLevelChange(level as keyof FilterState["levels"])
                }
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.categories[category]}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Precompiles</h3>
        <div className="space-y-2">
          {precompiles.map((precompile) => (
            <label key={precompile} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.precompiles[precompile]}
                onChange={() => handlePrecompileChange(precompile)}
              />
              <span>{precompile}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface SearchFilters {
  search: string;
  duration: string;
  difficulty: string;
  budget: string;
  groupSize: string;
}

interface TourSearchFilterProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export default function TourSearchFilter({
  onFilterChange,
}: TourSearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    duration: "",
    difficulty: "",
    budget: "",
    groupSize: "",
  });

  const handleChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      search: "",
      duration: "",
      difficulty: "",
      budget: "",
      groupSize: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Filter className="h-5 w-5 text-green-primary flex-shrink-0" />
        <h3 className="text-sm sm:text-lg font-bold text-text-dark">Search & Filter</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label
            htmlFor="search"
            className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
          >
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-dark/50" />
            <input
              id="search"
              type="text"
              placeholder="Tour or destination"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-9 pr-3 sm:pr-4 py-2 rounded-lg border border-border bg-background text-text-dark placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-green-primary text-xs sm:text-sm touch-target-min"
            />
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <label
            htmlFor="duration"
            className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
          >
            Duration
          </label>
          <select
            id="duration"
            value={filters.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-xs sm:text-sm"
          >
            <option value="">All Durations</option>
            <option value="3-5">3-5 days</option>
            <option value="6-10">6-10 days</option>
            <option value="11-15">11-15 days</option>
            <option value="15+">15+ days</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label
            htmlFor="difficulty"
            className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={filters.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-xs sm:text-sm"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <label
            htmlFor="budget"
            className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
          >
            Budget
          </label>
          <select
            id="budget"
            value={filters.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-xs sm:text-sm"
          >
            <option value="">All Budgets</option>
            <option value="under-1000">Under $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000+">$2,000+</option>
          </select>
        </div>

        {/* Group Size Filter */}
        <div>
          <label
            htmlFor="groupSize"
            className="block text-xs sm:text-sm font-semibold text-text-dark mb-1.5 sm:mb-2"
          >
            Group Size
          </label>
          <select
            id="groupSize"
            value={filters.groupSize}
            onChange={(e) => handleChange("groupSize", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-background text-text-dark focus:outline-none focus:ring-2 focus:ring-green-primary text-xs sm:text-sm"
          >
            <option value="">All Sizes</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="small">Small Group (4-6)</option>
            <option value="large">Large Group (7+)</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-3 sm:mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="text-xs sm:text-sm font-semibold text-blue-accent hover:text-blue-accent-dark transition-colors touch-target-min"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

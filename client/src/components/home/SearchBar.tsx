"use client";

import { Search } from "lucide-react";

export interface SearchFilters {
  city: string;
  area: string;
  roomType: string;
  minPrice: string;
  maxPrice: string;
}

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export function SearchBar({ filters, onChange, onSearch }: SearchBarProps) {
  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="bg-white rounded-[8px] p-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">City</label>
          <input
            className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Lahore, Karachi, Islamabad"
          />
        </div>

        <div className="md:col-span-3 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Area</label>
          <input
            className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
            value={filters.area}
            onChange={(e) => update("area", e.target.value)}
            placeholder="e.g. Gulberg, DHA, Clifton"
          />
        </div>

        <div className="md:col-span-2 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Room Type</label>
          <select
            className="bg-transparent text-[14px] text-[#131b2e] outline-none w-full -ml-px"
            value={filters.roomType}
            onChange={(e) => update("roomType", e.target.value)}
          >
            <option value="any">Any</option>
            <option value="Single Room">Single Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Full Apartment">Full Apartment</option>
          </select>
        </div>

        <div className="md:col-span-1 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Min (Rs)</label>
          <input
            type="number"
            className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min Rs"
          />
        </div>

        <div className="md:col-span-1 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Max (Rs)</label>
          <input
            type="number"
            className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max Rs"
          />
        </div>

        <button
          onClick={onSearch}
          className="md:col-span-2 h-12 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] font-medium transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </div>
    </div>
  );
}
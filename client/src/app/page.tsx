"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ListingsResponse } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { ListingCardSkeleton } from "@/components/common/ListingCardSkeleton";
import { ServerError } from "@/components/common/ServerError";
import { SearchBar, SearchFilters } from "@/components/home/SearchBar";
import { ListingCard } from "@/components/listings/ListingCard";

const PAGE_SIZE = 15;

const SORT_OPTIONS: Record<string, { sort: string; order: string }> = {
  newest: { sort: "created_at", order: "desc" },
  "price-asc": { sort: "price", order: "asc" },
  "price-desc": { sort: "price", order: "desc" },
};

const EMPTY_SEARCH: SearchFilters = {
  city: "", area: "", roomType: "any", minPrice: "", maxPrice: "",
};

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<SearchFilters>(EMPTY_SEARCH);
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    city: "", area: "", room_type: "", min_price: "", max_price: "",
    ...SORT_OPTIONS.newest,
  });

  const { data, isLoading, isError, refetch } = useQuery<ListingsResponse>({
    queryKey: ["listings", page, filters],
    queryFn: () =>
      api
        .get("/listings", {
          params: {
            page,
            city: filters.city || undefined,
            area: filters.area || undefined,
            room_type: filters.room_type || undefined,
            min_price: filters.min_price || undefined,
            max_price: filters.max_price || undefined,
            sort: filters.sort || undefined,
            order: filters.order || undefined,
          },
        })
        .then((res) => res.data),
  });

  function applyFilters(overrideSort?: string) {
    setPage(1);
    const sortKey = overrideSort ?? sort;
    setFilters({
      city: search.city,
      area: search.area,
      room_type: search.roomType === "any" ? "" : search.roomType,
      min_price: search.minPrice,
      max_price: search.maxPrice,
      ...(SORT_OPTIONS[sortKey] ?? SORT_OPTIONS.newest),
    });
  }

  function handleSortChange(value: string) {
    setSort(value);
    applyFilters(value);
  }

  function handleSearch() {
    applyFilters();
  }

  const from = data && data.total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = data ? Math.min(page * PAGE_SIZE, data.total) : 0;

  return (
    <div>
      <div className="bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
          <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#004e47] mb-2">
            DIRECT RENTAL EXCHANGE
          </p>
          <h1 className="text-[28px] leading-9 font-bold text-[#131b2e] tracking-tight mb-2">
            Find or share your next living space
          </h1>
          <p className="text-[16px] text-[#515f74] mb-8">
            Direct connection between space owners and seekers.
          </p>

          <SearchBar filters={search} onChange={setSearch} onSearch={handleSearch} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {data && (
              <>
                <span className="font-medium text-gray-700">{data.total}</span> listing
                {data.total === 1 ? "" : "s"} found{" "}
                <span className="text-gray-400">· Matching active inventory criteria</span>
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 text-sm bg-gray-50 border border-gray-100 rounded-md px-3 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isError && <ServerError onRetry={() => refetch()} />}

        {!isError && data && data.listings.length === 0 && (
          <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}

          {!isError &&
            data?.listings.map((listing) => (
              <ListingCard key={listing.listing_id} listing={listing} />
            ))}
        </div>

        {!isError && data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            <p className="text-xs text-gray-400">
              Showing {from}–{to} of {data.total} listings
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: data.totalPages }).map((_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-8 h-8 text-sm rounded-md border ${
                      num === page
                        ? "bg-teal-700 text-white border-teal-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
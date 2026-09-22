
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { ListingsResponse } from "@/types/listing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, SlidersHorizontal, ImageOff } from "lucide-react";
import { ListingCardSkeleton } from "@/components/common/ListingCardSkeleton";
import { ServerError } from "@/components/common/ServerError";
import Link from "next/link";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [roomType, setRoomType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [filters, setFilters] = useState({
    city: "", area: "", room_type: "", min_price: "", max_price: "", sort: "", order: "",
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

  function handleSearch() {
    setPage(1);
    setFilters({
      city,
      area,
      room_type: roomType === "any" ? "" : roomType,
      min_price: minPrice,
      max_price: maxPrice,
      sort: sort === "newest" ? "" : "price",
      order: sort === "price-asc" ? "asc" : sort === "price-desc" ? "desc" : "",
    });
  }

  const from = data && data.total > 0 ? (page - 1) * data.listings.length + 1 : 0;
  const to = data ? (page - 1) * (data.listings[0] ? data.listings.length : 0) + data.listings.length : 0;

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

          <div className="bg-white rounded-[8px] p-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-3 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">City</label>
                <input
                  className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                />
              </div>

              <div className="md:col-span-3 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Area</label>
                <input
                  className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulberg, DHA, Clifton"
                />
              </div>

              <div className="md:col-span-2 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Room Type</label>
                <select
                  className="bg-transparent text-[14px] text-[#131b2e] outline-none w-full -ml-px"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
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
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Rs"
                />
              </div>

              <div className="md:col-span-1 bg-[#f2f3ff80] rounded-[4px] px-3 py-1 flex flex-col justify-center">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">Max (Rs)</label>
                <input
                  type="number"
                  className="bg-transparent text-[14px] text-[#131b2e] placeholder:text-[#6e7977] outline-none w-full"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Rs"
                />
              </div>

              <button
                onClick={handleSearch}
                className="md:col-span-2 h-12 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] font-medium transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>
          </div>
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
            <button className="w-9 h-9 flex items-center justify-center border border-gray-100 rounded-md text-gray-400 hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
            <Select value={sort} onValueChange={(val) => setSort(val ?? "")}>
              <SelectTrigger className="w-44 h-9 text-sm bg-gray-50 border-gray-100">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
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
              <div
                key={listing.listing_id}
                className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
              >
                <div className="relative h-[190px] bg-gray-100 shrink-0">
                  {listing.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(listing.image_url) ?? ""}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageOff className="w-7 h-7" />
                    </div>
                  )}
                  <span className="absolute top-[14px] left-[12px] bg-white px-2 py-0.5 rounded-[6px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-[11px] font-semibold tracking-wide text-[#131b2e]">
                    {listing.room_type}
                  </span>
                </div>

                <div className="p-5 pb-0">
                  <h2 className="text-[16px] font-semibold text-[#131b2e] leading-6 mb-1 break-words">
                    {listing.title}
                  </h2>
                  <p className="flex items-center gap-1 text-[13px] text-[#515f74]">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {listing.city}, {listing.area}
                  </p>
                </div>

                <div className="mt-4 bg-[#F2F3FF66] px-5 py-4 flex items-center justify-between">
                  <span>
                    <span className="text-[16px] font-bold text-[#131b2e]">
                      Rs {listing.monthly_rent.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-[#515f74]"> / month</span>
                  </span>
                  <Link href={`/listings/${listing.listing_id}`}>
                    <button className="bg-[#dae2fd] hover:bg-[#c9d4fb] text-[#131b2e] text-[13px] font-medium px-4 py-2 rounded-[4px] transition-colors">
                      View Space
                    </button>
                  </Link>
                </div>
              </div>
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
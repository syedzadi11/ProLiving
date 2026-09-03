"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ListingsResponse } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
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

  const { data, isLoading, isError } = useQuery<ListingsResponse>({
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

  return (
    <div>
      {/* Hero + Search */}
      <div className="bg-teal-50/60 border-b border-teal-100">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find your next room
          </h1>
          <p className="text-gray-500 mb-8">
            Browse verified rooms and apartments near you
          </p>

          <Card className="p-5 shadow-sm border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">City</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-8"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Rawalpindi"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Area</label>
                <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Bahria Town" />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Room Type</label>
                <Select value={roomType} onValueChange={(val) => setRoomType(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Single Room">Single Room</SelectItem>
                    <SelectItem value="Shared Room">Shared Room</SelectItem>
                    <SelectItem value="Full Apartment">Full Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Budget (Rs)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button onClick={handleSearch} className="w-full gap-1.5">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {data ? `${data.total} rooms found` : ""}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <Select value={sort} onValueChange={(val) => setSort(val ?? "")}>
              <SelectTrigger className="w-44 h-9 text-sm">
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

        {isLoading && <p className="text-gray-500">Loading listings...</p>}

        {isError && (
          <p className="text-red-500">
            Could not load listings. Is the backend server running?
          </p>
        )}

        {data && data.listings.length === 0 && (
          <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data?.listings.map((listing) => (
            <Card
              key={listing.listing_id}
              className="p-4 border-gray-200 hover:shadow-md hover:border-teal-200 transition-all"
            >
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                {listing.room_type}
              </span>
              <h2 className="font-semibold mt-2.5 text-gray-900">{listing.title}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {listing.city}, {listing.area}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">
                  Rs {listing.monthly_rent}
                  <span className="text-xs font-normal text-gray-400">/mo</span>
                </span>
                <Link href={`/listings/${listing.listing_id}`}>
                  <Button size="sm" variant="outline">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm flex items-center px-3 text-gray-500">
              Page {page} of {data.totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
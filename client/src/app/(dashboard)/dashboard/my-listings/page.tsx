"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { DashboardTabs } from "@/components/common/DashboardTabs";
import { ListRowSkeleton } from "@/components/common/ListRowSkeleton";
import { ImageOff, Plus } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  Active: "bg-[#e2f7ee] text-[#0f7a4e]",
  Rented: "bg-[#f2f3ff] text-[#515f74]",
  Expired: "bg-red-100 text-red-600",
};

const actionBtn = "h-8 px-3 rounded-[4px] border border-[#dae2fd] text-[13px] font-medium text-[#131b2e] hover:bg-[#f2f3ff66] transition-colors";

export default function MyListingsPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !token) router.push("/login");
  }, [authLoading, token, router]);

  const { data, isLoading } = useQuery<{ listings: Listing[] }>({
    queryKey: ["my-listings"],
    queryFn: () => api.get("/listings/my-listings").then((res) => res.data),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/listings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Listing removed successfully.");
    },
  });

  const markRentedMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/listings/${id}/rented`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Listing marked as rented — hidden from search.");
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/listings/${id}/reactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Your listing is active again!");
    },
  });

  if (authLoading || !token) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-1 flex-wrap gap-3">
          <div>
            <h1 className="text-[24px] font-bold text-[#131b2e] tracking-tight">My Listings</h1>
            <p className="text-[13px] text-[#515f74] mt-1">
              Manage your posted spaces and update their status.
            </p>
          </div>
          <Link href="/post-listing">
            <button className="h-9 px-4 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] flex items-center gap-1.5 text-white text-[13px] font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Post Listing
            </button>
          </Link>
        </div>

        <DashboardTabs />

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
          </div>
        )}

        {data && data.listings.length === 0 && (
          <p className="text-[#515f74] text-[14px]">You haven&apos;t posted any listings yet.</p>
        )}

        {data && data.listings.length > 0 && (
          <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.8fr] gap-3 px-5 py-3 bg-[#f2f3ff] text-[11px] font-semibold text-[#515f74] tracking-wide uppercase">
              <span>Property & Space</span>
              <span>Room Type</span>
              <span>Rent</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-[#eaedff]">
              {data.listings.map((listing) => (
                <div
                  key={listing.listing_id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1.8fr] gap-3 px-5 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-[6px] overflow-hidden bg-[#f2f3ff] flex-shrink-0">
                      {listing.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImageUrl(listing.image_url) ?? ""}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#c7cef0]">
                          <ImageOff className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#131b2e] leading-tight break-words">
                        {listing.title}
                      </h3>
                      <p className="text-[13px] text-[#515f74]">
                        {listing.area}, {listing.city}
                      </p>
                    </div>
                  </div>

                  <span className="text-[12px] font-medium bg-[#eaedff] text-[#131b2e] px-2 py-1 rounded-full w-fit">
                    {listing.room_type}
                  </span>

                  <span className="text-[14px] font-semibold text-[#131b2e]">
                    Rs {listing.monthly_rent.toLocaleString()}
                    <span className="text-[12px] font-normal text-[#515f74]"> / month</span>
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full w-fit ${statusStyles[listing.status]}`}
                  >
                    {listing.status}
                  </span>

                  <div className="flex gap-2 flex-wrap md:justify-end">
                    <Link href={`/listings/${listing.listing_id}/edit`}>
                      <button className={actionBtn}>Edit</button>
                    </Link>

                    {listing.status === "Active" && (
                      <button
                        className={actionBtn}
                        onClick={() => markRentedMutation.mutate(listing.listing_id)}
                      >
                        Mark as Rented
                      </button>
                    )}

                    {(listing.status === "Expired" || listing.status === "Rented") && (
                      <button
                        className={actionBtn}
                        onClick={() => reactivateMutation.mutate(listing.listing_id)}
                      >
                        Reactivate
                      </button>
                    )}

                    <button
                      className={`${actionBtn} text-[#ba1a1a] border-red-200 hover:bg-red-50`}
                      onClick={() => {
                        if (confirm("Delete this listing?")) {
                          deleteMutation.mutate(listing.listing_id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
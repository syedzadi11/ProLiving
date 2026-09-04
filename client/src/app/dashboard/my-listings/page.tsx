"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { DashboardTabs } from "@/components/DashboardTabs";
import { ListRowSkeleton } from "@/components/ListRowSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Rented: "bg-gray-200 text-gray-600",
  Expired: "bg-red-100 text-red-600",
};

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
      toast.success("Listing deleted.");
    },
  });

  const markRentedMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/listings/${id}/rented`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Marked as rented.");
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/listings/${id}/reactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Listing reactivated.");
    },
  });

  if (authLoading || !token) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <DashboardTabs />

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
        </div>
      )}

      {data && data.listings.length === 0 && (
        <p className="text-gray-500">You haven&apos;t posted any listings yet.</p>
      )}

      <div className="space-y-4">
        {data?.listings.map((listing) => (
          <Card key={listing.listing_id} className="p-4 flex gap-4 items-center">
            <div className="flex-1">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[listing.status]}`}
              >
                {listing.status}
              </span>
              <h3 className="font-semibold mt-1">{listing.title}</h3>
              <p className="text-sm text-gray-500">
                {listing.city}, {listing.area} — Rs {listing.monthly_rent}/mo
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Link href={`/listings/${listing.listing_id}/edit`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>

                {listing.status === "Active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markRentedMutation.mutate(listing.listing_id)}
                  >
                    Mark Rented
                  </Button>
                )}

                {listing.status === "Expired" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reactivateMutation.mutate(listing.listing_id)}
                  >
                    Reactivate
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Delete this listing?")) {
                      deleteMutation.mutate(listing.listing_id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
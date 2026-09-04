"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ConnectionRequest } from "@/types/connection";
import { useAuth } from "@/context/AuthContext";
import { DashboardTabs } from "@/components/DashboardTabs";
import { ListRowSkeleton } from "@/components/ListRowSkeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

export default function MyRequestsPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !token) router.push("/login");
  }, [authLoading, token, router]);

  const { data, isLoading } = useQuery<{ requests: ConnectionRequest[] }>({
    queryKey: ["my-requests"],
    queryFn: () => api.get("/connections/my-requests").then((res) => res.data),
    enabled: !!token,
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/connections/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast.success("Request withdrawn.");
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

      {data && data.requests.length === 0 && (
        <p className="text-gray-500">You haven&apos;t sent any requests yet.</p>
      )}

      <div className="space-y-4">
        {data?.requests.map((req) => (
          <Card key={req.connection_id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">
                {req.Listing?.title || `Listing #${req.listing_id}`}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[req.status]}`}
              >
                {req.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-3">
              {req.message}
            </p>

            {req.status === "Accepted" && req.Listing?.User?.phone && (
              <p className="text-sm bg-green-50 text-green-700 rounded-lg p-3 font-medium">
                📞 Contact {req.Listing.User.full_name}: {req.Listing.User.phone}
              </p>
            )}

            {req.status === "Pending" && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => withdrawMutation.mutate(req.connection_id)}
              >
                Withdraw Request
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
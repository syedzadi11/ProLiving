"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { ConnectionRequest } from "@/types/connection";
import { useAuth } from "@/context/AuthContext";
import { DashboardTabs } from "@/components/common/DashboardTabs";
import { ListRowSkeleton } from "@/components/common/ListRowSkeleton";
import { ImageOff, Phone, Copy, Info } from "lucide-react";

const statusStyles: Record<string, string> = {
  Pending: "bg-[#fef3c7] text-[#92620a]",
  Accepted: "bg-[#e2f7ee] text-[#0f7a4e]",
  Rejected: "bg-red-100 text-red-600",
};

const actionBtn = "h-9 px-3.5 rounded-[4px] border border-[#dae2fd] text-[13px] font-medium text-[#131b2e] hover:bg-[#f2f3ff66] transition-colors flex items-center gap-1.5";

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
      toast.success("Your request has been withdrawn.");
    },
  });

  function copyPhone(phone: string) {
    navigator.clipboard.writeText(phone);
    toast.success("Phone number copied.");
  }

  if (authLoading || !token) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  const requests = data?.requests ?? [];
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const acceptedCount = requests.filter((r) => r.status === "Accepted").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h1 className="text-[24px] font-bold text-[#131b2e] tracking-tight">My Requests</h1>
            <p className="text-[13px] text-[#515f74] mt-1">
              Manage room requests and inquiries you&apos;ve sent.
            </p>
          </div>
          {requests.length > 0 && (
            <div className="flex items-center gap-3 text-[12px] font-medium text-[#515f74]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#eab308]" /> {pendingCount} Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0f7a4e]" /> {acceptedCount} Accepted
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" /> {rejectedCount} Rejected
              </span>
            </div>
          )}
        </div>

        <DashboardTabs />

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
          </div>
        )}

        {data && data.requests.length === 0 && (
          <p className="text-[#515f74] text-[14px]">You haven&apos;t sent any requests yet.</p>
        )}

        <div className="space-y-4">
          {requests.map((req) => {
            const phone = req.status === "Accepted" ? req.Listing?.User?.phone : undefined;
            return (
              <div
                key={req.connection_id}
                className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-5"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-[6px] overflow-hidden bg-[#f2f3ff] flex-shrink-0">
                    {req.Listing?.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(req.Listing.image_url) ?? ""}
                        alt={req.Listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c7cef0]">
                        <ImageOff className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-[#131b2e] break-words">
                          {req.Listing?.title || `Listing #${req.listing_id}`}
                        </h3>
                        {req.Listing && (
                          <p className="text-[12px] text-[#515f74]">
                            {req.Listing.area}, {req.Listing.city}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${statusStyles[req.status]}`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74] mt-2 mb-1">
                      Your message sent to lister
                    </p>
                    <p className="text-[13px] text-[#3e4947] bg-[#f2f3ff66] rounded-[6px] p-3 mb-3 break-words">
                      &quot;{req.message}&quot;
                    </p>

                    {req.status === "Accepted" && phone && (
                      <div className="flex items-center justify-between bg-[#e2f7ee] rounded-[6px] p-3 flex-wrap gap-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0f7a4e80]">
                            Direct Contact Unlocked
                          </p>
                          <p className="text-[14px] font-semibold text-[#0f7a4e]">{phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <a href={`tel:${phone}`}>
                            <button className="h-9 px-3.5 bg-[#0f7a4e] hover:bg-[#0c6340] rounded-[4px] flex items-center gap-1.5 text-white text-[13px] font-medium transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                              Call
                            </button>
                          </a>
                          <button className={actionBtn} onClick={() => copyPhone(phone)}>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                        </div>
                      </div>
                    )}

                    {req.status === "Pending" && (
                      <button
                        className={`${actionBtn} text-[#ba1a1a] border-red-200 hover:bg-red-50`}
                        onClick={() => withdrawMutation.mutate(req.connection_id)}
                      >
                        Withdraw Request
                      </button>
                    )}

                    {req.status === "Rejected" && (
                      <p className="text-[13px] text-[#515f74]">
                        Request declined. No further action available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {requests.length > 0 && (
          <p className="flex items-center gap-1.5 text-[12px] text-[#515f74] mt-6">
            <Info className="w-3.5 h-3.5" />
            Contact details are shared only after the owner accepts your request.
          </p>
        )}
      </div>
    </div>
  );
}
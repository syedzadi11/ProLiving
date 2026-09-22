"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ConnectionRequest } from "@/types/connection";
import { useAuth } from "@/context/AuthContext";
import { DashboardTabs } from "@/components/common/DashboardTabs";
import { ListRowSkeleton } from "@/components/common/ListRowSkeleton";
import { Lock, Phone, Copy, Check, X } from "lucide-react";

const statusStyles: Record<string, string> = {
  Pending: "bg-[#fef3c7] text-[#92620a]",
  Accepted: "bg-[#e2f7ee] text-[#0f7a4e]",
  Rejected: "bg-red-100 text-red-600",
};

const actionBtn = "h-9 px-3.5 rounded-[4px] border border-[#dae2fd] text-[13px] font-medium text-[#131b2e] hover:bg-[#f2f3ff66] transition-colors flex items-center gap-1.5";

export default function IncomingRequestsPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !token) router.push("/login");
  }, [authLoading, token, router]);

  const { data, isLoading } = useQuery<{ requests: ConnectionRequest[] }>({
    queryKey: ["incoming-requests"],
    queryFn: () => api.get("/connections/incoming").then((res) => res.data),
    enabled: !!token,
  });

  const decisionMutation = useMutation({
    mutationFn: ({ id, decision }: { id: number; decision: "Accepted" | "Rejected" }) =>
      api.patch(`/connections/${id}/decision`, { decision }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["incoming-requests"] });
      toast.success(
        variables.decision === "Accepted"
          ? "Request accepted — your contact info has been shared."
          : "Request declined."
      );
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

  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h1 className="text-[24px] font-bold text-[#131b2e] tracking-tight">Incoming Requests</h1>
            <p className="text-[13px] text-[#515f74] mt-1">
              Manage inquiries and requests for your spaces.
            </p>
          </div>
          {requests.length > 0 && (
            <span className="text-[12px] font-medium text-[#515f74]">
              {pendingCount} pending · {requests.length} total
            </span>
          )}
        </div>

        <DashboardTabs />

        {requests.length > 0 && (
          <div className="flex items-start gap-2 bg-[#f2f3ff] rounded-[8px] p-3 mb-5">
            <Lock className="w-4 h-4 text-[#515f74] mt-0.5 shrink-0" />
            <p className="text-[12px] text-[#515f74]">
              To prevent spam, phone numbers stay hidden until you accept an inquiry.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
          </div>
        )}

        {data && data.requests.length === 0 && (
          <p className="text-[#515f74] text-[14px]">No incoming requests yet.</p>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.connection_id}
              className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-5"
            >
              <div className="flex justify-between items-start mb-2 gap-2">
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
                Applicant note
              </p>
              <p className="text-[13px] text-[#3e4947] bg-[#f2f3ff66] rounded-[6px] p-3 mb-3 break-words">
                &quot;{req.message}&quot;
              </p>

              {req.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    className="h-9 px-3.5 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] flex items-center gap-1.5 text-white text-[13px] font-medium transition-colors"
                    onClick={() =>
                      decisionMutation.mutate({ id: req.connection_id, decision: "Accepted" })
                    }
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    className={`${actionBtn} text-[#ba1a1a] border-red-200 hover:bg-red-50`}
                    onClick={() =>
                      decisionMutation.mutate({ id: req.connection_id, decision: "Rejected" })
                    }
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}

              {req.status === "Accepted" && req.ownerPhone && (
                <div className="flex items-center justify-between bg-[#e2f7ee] rounded-[6px] p-3 flex-wrap gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0f7a4e80]">
                      Applicant Contact Unlocked
                    </p>
                    <p className="text-[14px] font-semibold text-[#0f7a4e]">{req.ownerPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${req.ownerPhone}`}>
                      <button className="h-9 px-3.5 bg-[#0f7a4e] hover:bg-[#0c6340] rounded-[4px] flex items-center gap-1.5 text-white text-[13px] font-medium transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </button>
                    </a>
                    <button className={actionBtn} onClick={() => copyPhone(req.ownerPhone!)}>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {req.status === "Rejected" && (
                <p className="text-[13px] text-[#515f74]">Declined · No contact shared.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
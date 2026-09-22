

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ImageOff, Lock, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";

const QUICK_PROMPTS = ["Move-in by 1st of next month", "Working professional nearby"];

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  const { data, isLoading, isError } = useQuery<{ listing: Listing }>({
    queryKey: ["listing", id],
    queryFn: () => api.get(`/listings/${id}`).then((res) => res.data),
  });

  async function handleSendRequest() {
    setRequestError("");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await api.post("/connections", {
        listing_id: Number(id),
        message,
      });
      setRequestSuccess(true);
      toast.success("Your request has been sent to the owner.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRequestError(err.response?.data?.message || "Could not send request.");
      } else {
        setRequestError("Could not send request.");
      }
    }
  }

  function addQuickPrompt(prompt: string) {
    setMessage((prev) => (prev ? `${prev} ${prompt}.` : `${prompt}.`));
  }

  if (isLoading) return <p className="text-center py-16 text-gray-500">Loading...</p>;
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
        <p className="text-gray-500 mb-6 max-w-md">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const listing = data.listing;
  const isOwner = user?.id === listing.user_id;
  const ownerName = listing.User?.full_name ?? "the owner";

  return (
    <div className="bg-[#faf8ff] pt-8 pb-6 px-6 md:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2 text-[13px] text-[#515f74] pb-2 mb-6">
          <Link href="/" className="font-medium hover:text-[#00685f]">Listings</Link>
          <span className="text-[#bec9c6]">/</span>
          <span className="font-medium text-[#131b2e]">{listing.area}, {listing.city}</span>
        </div>

        <div className="relative h-[300px] md:h-[480px] bg-[#f2f3ff] rounded-[8px] overflow-hidden shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] mb-8">
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl(listing.image_url) ?? ""}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageOff className="w-10 h-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#283044cc] via-[#28304433] to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="max-w-[672px]">
              <span className="inline-block bg-[#00685f] text-white text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-[6px] mb-2">
                {listing.room_type}
              </span>
              <h1 className="text-2xl md:text-[36px] md:leading-[44px] font-semibold text-white tracking-tight break-words">
                {listing.title}
              </h1>
              <p className="text-sm md:text-[14px] text-[#e2e7ff] mt-1 break-words">
                {listing.area}, {listing.city}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-[8px] px-5 py-3 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74] mb-0.5">
                Monthly Rent
              </p>
              <p className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-[28px] leading-9 font-bold text-[#004e47] tracking-tight">
                  Rs {listing.monthly_rent.toLocaleString()}
                </span>
                <span className="text-[13px] text-[#515f74]">/ month</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 flex flex-col gap-6 min-w-0">
            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-5 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">
                  Listing Contact
                </p>
                <p className="text-[16px] font-semibold text-[#131b2e] mt-0.5 break-words">
                  Posted by {ownerName}
                </p>
              </div>
              {!isOwner && (
                <span className="flex items-center gap-1.5 bg-[#f2f3ff] text-[#515f74] text-[11px] font-semibold px-3 py-2 rounded-[4px]">
                  <Lock className="w-3 h-3" />
                  Phone hidden until request accepted
                </span>
              )}
            </div>

            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6 md:p-8">
              <h2 className="text-[20px] font-semibold text-[#131b2e] tracking-tight pb-3 mb-4 border-b border-[#e2e7ff66]">
                About the Room &amp; Flat Layout
              </h2>
              <p className="text-[16px] leading-[26px] text-[#515f74] whitespace-pre-line break-words">
                {listing.description}
              </p>
            </div>

            <div className="bg-[#f2f3ff] rounded-[8px] p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#131b2e]">
                  Structured Communication Safe Zone
                </p>
                <p className="text-[13px] text-[#515f74] mt-1">
                  {ownerName} will review your introduced move-in timeline and introductory
                  note. Once {ownerName} approves the connection request, verified mutual
                  direct contact details will be made immediately visible.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 min-w-0">
            <div className="bg-white rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-5">
              {isOwner ? (
                <p className="text-sm text-gray-500">This is your own listing.</p>
              ) : requestSuccess ? (
                <p className="text-sm text-green-600 font-medium">
                  Request sent successfully! You&apos;ll see the owner&apos;s contact details
                  in &quot;My Requests&quot; once they accept.
                </p>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-[#131b2e] tracking-tight">
                        Send Connection Request
                      </h3>
                      <span className="bg-[#f2f3ff] text-[#004e47] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        Direct
                      </span>
                    </div>
                    <p className="text-[13px] text-[#515f74] mt-1 break-words">
                      Contact {ownerName} to inquire about coordinating move-in dates or
                      planning an in-person room walkthrough.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-medium text-[#131b2e]">
                        Message to {ownerName}
                      </label>
                      <span className="text-[11px] font-semibold text-[#515f74]">Required</span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Introduce yourself and mention your preferred move-in timeline..."
                      rows={4}
                      className="bg-[#f2f3ff66] rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] px-3 py-3 text-[14px] text-[#131b2e] placeholder:text-[#bec9c6] outline-none w-full resize-none"
                    />
                    <p className="text-[13px] text-[#515f74]">
                      Tip: Mention your target stay duration and everyday work schedule.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">
                      Quick Prompts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => addQuickPrompt(prompt)}
                          className="bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] text-[11px] font-semibold px-2 py-1 rounded-[6px] transition-colors"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {requestError && (
                    <p className="text-sm text-red-500">{requestError}</p>
                  )}

                  <button
                    onClick={handleSendRequest}
                    className="bg-[#00685f] hover:bg-[#00534c] h-11 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] font-medium transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
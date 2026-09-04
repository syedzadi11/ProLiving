"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
      toast.success("Request sent to the owner!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRequestError(err.response?.data?.message || "Could not send request.");
      } else {
        setRequestError("Could not send request.");
      }
    }
  }

  if (isLoading) return <p className="text-center py-16 text-gray-500">Loading...</p>;
  if (isError || !data) return <p className="text-center py-16 text-red-500">Listing not found.</p>;

  const listing = data.listing;
  const isOwner = user?.id === listing.user_id;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8">
      <div>
        <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
          {listing.room_type}
        </span>
        <h1 className="text-2xl font-bold mt-3">{listing.title}</h1>
        <p className="text-gray-500 mb-4">
          {listing.city}, {listing.area}
        </p>
        {listing.User && (
          <p className="text-sm text-gray-500 mb-4">
            Listed by <span className="font-medium text-gray-700">{listing.User.full_name}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 font-semibold mb-1">About the space</p>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </div>

      <Card className="p-6 h-fit">
        <div className="text-2xl font-bold">
          Rs {listing.monthly_rent}
          <span className="text-sm font-normal text-gray-500"> /month</span>
        </div>
        <span className="inline-block mt-2 mb-4 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
          {listing.status}
        </span>

        {isOwner ? (
          <p className="text-sm text-gray-500">This is your own listing.</p>
        ) : requestSuccess ? (
          <p className="text-sm text-green-600 font-medium">
            Request sent successfully!
          </p>
        ) : (
          <>
            <p className="text-sm font-semibold mb-2">Send a Request</p>
            <Textarea
              placeholder="Introduce yourself to the owner..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mb-3"
            />
            {requestError && (
              <p className="text-sm text-red-500 mb-2">{requestError}</p>
            )}
            <Button className="w-full" onClick={handleSendRequest}>
              Send Request
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
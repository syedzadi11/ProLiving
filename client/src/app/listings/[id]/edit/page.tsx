"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { api } from "@/lib/api";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token, isLoading: authLoading } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  useEffect(() => {
    if (!authLoading && !token) router.push("/login");
  }, [authLoading, token, router]);

  const { data, isLoading } = useQuery<{ listing: Listing }>({
    queryKey: ["listing", id],
    queryFn: () => api.get(`/listings/${id}`).then((res) => res.data),
    enabled: !!token,
  });

  useEffect(() => {
    if (data?.listing) {
      reset({
        title: data.listing.title,
        description: data.listing.description,
        city: data.listing.city,
        area: data.listing.area,
        room_type: data.listing.room_type,
        monthly_rent: data.listing.monthly_rent,
      });
    }
  }, [data, reset]);

  async function onSubmit(formData: ListingFormData) {
    setServerError("");
    try {
      await api.put(`/listings/${id}`, formData);
      toast.success("Listing updated!");
      router.push("/dashboard/my-listings");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Could not update listing.");
      } else {
        setServerError("Could not update listing.");
      }
    }
  }

  if (authLoading || !token || isLoading) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex justify-center py-12 px-4">
      <Card className="w-full max-w-xl p-8">
        <h1 className="text-2xl font-bold mb-1">Edit Your Listing</h1>
        <p className="text-sm text-gray-500 mb-6">Update your listing details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Input id="area" {...register("area")} />
              {errors.area && (
                <p className="text-sm text-red-500 mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room_type">Room Type</Label>
              <Select
                defaultValue={data?.listing.room_type}
                onValueChange={(val) => setValue("room_type", val as ListingFormData["room_type"])}
              >
                <SelectTrigger id="room_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Room">Single Room</SelectItem>
                  <SelectItem value="Shared Room">Shared Room</SelectItem>
                  <SelectItem value="Full Apartment">Full Apartment</SelectItem>
                </SelectContent>
              </Select>
              {errors.room_type && (
                <p className="text-sm text-red-500 mt-1">{errors.room_type.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="monthly_rent">Monthly Rent (Rs)</Label>
              <Input id="monthly_rent" type="number" {...register("monthly_rent")} />
              {errors.monthly_rent && (
                <p className="text-sm text-red-500 mt-1">{errors.monthly_rent.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Listing"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
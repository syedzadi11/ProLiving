"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { api } from "@/lib/api";
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

export default function PostListingPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  // Protect this route: redirect if not logged in
  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  async function onSubmit(formData: ListingFormData) {
    setServerError("");
    try {
      await api.post("/listings", formData);
      router.push("/dashboard/my-listings");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Could not create listing.");
      } else {
        setServerError("Could not create listing.");
      }
    }
  }

  // Don't render the form until we know the user is logged in
  if (authLoading || !token) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex justify-center py-12 px-4">
      <Card className="w-full max-w-xl p-8">
        <h1 className="text-2xl font-bold mb-1">Post Your Listing</h1>
        <p className="text-sm text-gray-500 mb-6">
          Share your space with our community
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g. Sunny Room in Downtown" />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Tell us about the space..."
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="Rawalpindi" />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Input id="area" {...register("area")} placeholder="Bahria Town" />
              {errors.area && (
                <p className="text-sm text-red-500 mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room_type">Room Type</Label>
              <Select onValueChange={(val) => setValue("room_type", val as ListingFormData["room_type"])}>
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
              <Input
                id="monthly_rent"
                type="number"
                {...register("monthly_rent")}
                placeholder="0"
              />
              {errors.monthly_rent && (
                <p className="text-sm text-red-500 mt-1">{errors.monthly_rent.message}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Listing"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
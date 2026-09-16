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
import { getImageUrl } from "@/lib/getImageUrl";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      if (data.listing.image_url) {
        setImagePreview(getImageUrl(data.listing.image_url));
      }
    }
  }, [data, reset]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function onSubmit(formData: ListingFormData) {
    setServerError("");
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("city", formData.city);
      payload.append("area", formData.area);
      payload.append("room_type", formData.room_type);
      payload.append("monthly_rent", String(formData.monthly_rent));
      if (imageFile) {
        payload.append("image", imageFile);
      }

      await api.put(`/listings/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your changes have been saved.");
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

          <div>
            <Label>Listing Photo</Label>
            {imagePreview ? (
              <div className="relative mt-1.5 w-full h-44 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="mt-1.5 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:bg-gray-50 text-gray-400">
                <ImagePlus className="w-6 h-6" />
                <span className="text-xs">Click to upload a photo (JPG, PNG, WEBP — max 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
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
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { api } from "@/lib/api";
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

export default function PostListingPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

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

      await api.post("/listings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your listing is now live!");
      router.push("/dashboard/my-listings");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Could not create listing.");
      } else {
        setServerError("Could not create listing.");
      }
    }
  }

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

          <div>
            <Label>Listing Photo (optional)</Label>
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
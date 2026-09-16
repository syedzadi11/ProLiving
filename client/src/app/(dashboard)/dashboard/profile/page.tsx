

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { profileSchema, ProfileFormData } from "@/lib/validations/profile";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { UserProfileResponse } from "@/types/user";
import { Listing } from "@/types/listing";
import { ConnectionRequest } from "@/types/connection";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserRound, Camera, Building2, Send, Inbox } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) router.push("/login");
  }, [authLoading, token, router]);

  const { data, isLoading } = useQuery<UserProfileResponse>({
    queryKey: ["my-profile"],
    queryFn: () => api.get("/users/me").then((res) => res.data),
    enabled: !!token,
  });

  const { data: myListings } = useQuery<{ listings: Listing[] }>({
    queryKey: ["my-listings"],
    queryFn: () => api.get("/listings/my-listings").then((res) => res.data),
    enabled: !!token,
  });

  const { data: myRequests } = useQuery<{ requests: ConnectionRequest[] }>({
    queryKey: ["my-requests"],
    queryFn: () => api.get("/connections/my-requests").then((res) => res.data),
    enabled: !!token,
  });

  const { data: incomingRequests } = useQuery<{ requests: ConnectionRequest[] }>({
    queryKey: ["incoming-requests"],
    queryFn: () => api.get("/connections/incoming").then((res) => res.data),
    enabled: !!token,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        full_name: data.user.full_name,
        phone: data.user.phone,
        city: data.user.city,
      });
      if (data.user.profile_photo) {
        setPhotoPreview(getImageUrl(data.user.profile_photo));
      }
    }
  }, [data, reset]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(formData: ProfileFormData) {
    setServerError("");
    try {
      const payload = new FormData();
      payload.append("full_name", formData.full_name);
      payload.append("phone", formData.phone);
      payload.append("city", formData.city);
      if (photoFile) {
        payload.append("profile_photo", photoFile);
      }

      await api.put("/users/me", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Your profile has been updated.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Could not update profile.");
      } else {
        setServerError("Could not update profile.");
      }
    }
  }

  if (authLoading || !token || isLoading) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  const listingsCount = myListings?.listings.length ?? 0;
  const sentCount = myRequests?.requests.length ?? 0;
  const incomingCount = incomingRequests?.requests.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserRound className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{data?.user.full_name}</h1>
          <p className="text-sm text-gray-500">{data?.user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Card className="p-4 text-center">
          <Building2 className="w-4 h-4 mx-auto text-teal-600 mb-1" />
          <p className="text-lg font-bold text-gray-900">{listingsCount}</p>
          <p className="text-xs text-gray-500">Listings</p>
        </Card>
        <Card className="p-4 text-center">
          <Send className="w-4 h-4 mx-auto text-teal-600 mb-1" />
          <p className="text-lg font-bold text-gray-900">{sentCount}</p>
          <p className="text-xs text-gray-500">Sent Requests</p>
        </Card>
        <Card className="p-4 text-center">
          <Inbox className="w-4 h-4 mx-auto text-teal-600 mb-1" />
          <p className="text-lg font-bold text-gray-900">{incomingCount}</p>
          <p className="text-xs text-gray-500">Incoming</p>
        </Card>
      </div>

      {/* Edit Form */}
      <Card className="p-8">
        <h2 className="text-lg font-bold mb-1">Edit Profile</h2>
        <p className="text-sm text-gray-500 mb-6">
          This information is private and only visible to you.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserRound className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 border border-teal-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-teal-50">
                <Camera className="w-4 h-4" />
                Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WEBP — max 5MB</p>
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input value={data?.user.email ?? ""} disabled className="bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
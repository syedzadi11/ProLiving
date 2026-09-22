"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { Listing } from "@/types/listing";
import { useAuth } from "@/context/AuthContext";
import { X, Save } from "lucide-react";
import Link from "next/link";

const fieldBox = "bg-white border border-[#dae2fd] rounded-[4px] px-3 py-2.5 outline-none w-full text-[14px] text-[#131b2e] placeholder:text-[#6e7977] focus:border-[#00685f]";
const labelStyle = "text-[13px] font-medium text-[#131b2e]";
const errorStyle = "text-[13px] text-red-500 mt-1";
const counterStyle = "text-[12px] font-mono text-[#3e4947]";

const statusPillStyles: Record<string, string> = {
  Active: "bg-[#eaedff] text-[#131b2e]",
  Rented: "bg-gray-100 text-gray-600",
  Expired: "bg-red-100 text-red-600",
};

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token, isLoading: authLoading } = useAuth();
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [imageSizeLabel, setImageSizeLabel] = useState<string>("Uploaded");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
  });

  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";

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
        setImageName(data.listing.image_url.split("/").pop() ?? "listing-photo.jpg");
        setImageSizeLabel("Uploaded");
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
    setImageName(file.name);
    setImageSizeLabel(`${formatFileSize(file.size)} • Ready to upload`);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageName("");
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
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)] flex justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard/my-listings" className="text-[13px] text-[#3e4947] hover:text-[#00685f]">
            ‹ Back to Listings
          </Link>
          {data?.listing.status && (
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${statusPillStyles[data.listing.status]}`}>
              {data.listing.status} Listing
            </span>
          )}
        </div>
        <h1 className="text-[20px] font-semibold text-[#131b2e] tracking-tight mb-1">
          Edit Listing
        </h1>
        <p className="text-[13px] text-[#3e4947] mb-6">Update your listing details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelStyle}>Title</label>
              <span className={counterStyle}>{titleValue.length}/90</span>
            </div>
            <input className={fieldBox} maxLength={90} {...register("title")} />
            {errors.title && <p className={errorStyle}>{errors.title.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelStyle}>Description</label>
              <span className={counterStyle}>{descriptionValue.length}/400</span>
            </div>
            <textarea
              rows={4}
              maxLength={400}
              className={`${fieldBox} resize-none`}
              {...register("description")}
            />
            {errors.description && <p className={errorStyle}>{errors.description.message}</p>}
          </div>

          <div>
            <label className={`${labelStyle} mb-2 block`}>Listing Photo</label>
            {imagePreview ? (
              <div className="bg-[#f2f3ff] border border-[#dae2fd] rounded-[8px] p-3 flex gap-4 items-center">
                <div className="w-24 h-20 rounded-[4px] overflow-hidden border border-[#e2e7ff] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-[#131b2e] truncate">
                      {imageName}
                    </span>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#ba1a1a] shrink-0"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                  <p className="text-[13px] text-[#3e4947]">{imageSizeLabel}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#eaedff] border border-[#dae2fd] text-[#131b2e] text-[11px] font-semibold px-3 py-1 rounded-[4px]"
                    >
                      Replace photo
                    </button>
                    <span className="text-[13px] text-[#3e4947]">JPG or PNG, up to 5MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#dae2fd] bg-[#f2f3ff33] rounded-[8px] h-32 cursor-pointer hover:bg-[#f2f3ff66] text-[#6e7977] transition-colors">
                <span className="text-[13px] font-medium text-[#3e4947]">
                  Drag and drop a photo here, or click to browse
                </span>
                <span className="text-[11px] text-[#6e7977]">JPG or PNG, up to 5MB</span>
              </label>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${labelStyle} mb-1 block`}>City</label>
              <input className={fieldBox} {...register("city")} />
              {errors.city && <p className={errorStyle}>{errors.city.message}</p>}
            </div>
            <div>
              <label className={`${labelStyle} mb-1 block`}>Area</label>
              <input className={fieldBox} {...register("area")} />
              {errors.area && <p className={errorStyle}>{errors.area.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${labelStyle} mb-1 block`}>Room Type</label>
              <select className={fieldBox} {...register("room_type")}>
                <option value="Single Room">Single Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Full Apartment">Full Apartment</option>
              </select>
              {errors.room_type && <p className={errorStyle}>{errors.room_type.message}</p>}
            </div>
            <div>
              <label className={`${labelStyle} mb-1 block`}>Monthly Rent (Rs)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-[#3e4947]">Rs</span>
                <input type="number" className={`${fieldBox} pl-8`} {...register("monthly_rent")} />
              </div>
              {errors.monthly_rent && <p className={errorStyle}>{errors.monthly_rent.message}</p>}
            </div>
          </div>

          {serverError && (
            <p className="text-[13px] text-red-500 text-center">{serverError}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/my-listings")}
              className="h-9 px-4 bg-[#eaedff] rounded-[4px] text-[13px] font-medium text-[#131b2e]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-6 bg-[#00685f] hover:bg-[#00534c] disabled:opacity-60 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] font-medium transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <p className="text-[12px] font-mono text-[#3e4947] mt-4">
          Reference: LST-{String(id).padStart(5, "0")}
        </p>
      </div>
    </div>
  );
}




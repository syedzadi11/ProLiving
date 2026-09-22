

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
import { ImagePlus, X, ArrowRight } from "lucide-react";

const fieldBox = "bg-white border border-[#dae2fd] rounded-[4px] px-3 py-2.5 outline-none w-full text-[14px] text-[#131b2e] placeholder:text-[#6e7977] focus:border-[#00685f]";
const labelStyle = "text-[13px] font-medium text-[#131b2e]";
const errorStyle = "text-[13px] text-red-500 mt-1";
const counterStyle = "text-[12px] font-mono text-[#3e4947]";
const required = <span className="text-red-500">*</span>;

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: { title: "", description: "" },
  });

  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";

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
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)] flex justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-8">
        <h1 className="text-[20px] font-semibold text-[#131b2e] tracking-tight mb-1">
          Post a Listing
        </h1>
        <p className="text-[13px] text-[#3e4947] mb-6">
          Provide details about your room or property
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelStyle}>Title {required}</label>
              <span className={counterStyle}>{titleValue.length}/90</span>
            </div>
            <input
              className={fieldBox}
              maxLength={90}
              {...register("title")}
              placeholder="e.g. Spacious Master Bedroom in Gulberg"
            />
            {errors.title && <p className={errorStyle}>{errors.title.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelStyle}>Description {required}</label>
              <span className={counterStyle}>{descriptionValue.length}/400</span>
            </div>
            <textarea
              rows={4}
              maxLength={400}
              className={`${fieldBox} resize-none`}
              {...register("description")}
              placeholder="Describe the space, furnishing, and living arrangement..."
            />
            {errors.description && <p className={errorStyle}>{errors.description.message}</p>}
          </div>

          <div>
            <label className={`${labelStyle} mb-1 block`}>
              Listing Photo <span className="font-normal text-[#3e4947]">(Optional)</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-[8px] overflow-hidden bg-[#f2f3ff]">
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
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#dae2fd] bg-[#f2f3ff33] rounded-[8px] h-32 cursor-pointer hover:bg-[#f2f3ff66] text-[#6e7977] transition-colors">
                <ImagePlus className="w-6 h-6" />
                <span className="text-[13px] font-medium text-[#3e4947]">
                  Drag and drop a photo here, or click to browse
                </span>
                <span className="text-[11px] text-[#6e7977]">JPG or PNG, up to 5MB</span>
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
              <label className={`${labelStyle} mb-1 block`}>City {required}</label>
              <input
                className={fieldBox}
                {...register("city")}
                placeholder="e.g. Lahore, Karachi, Islamabad"
              />
              {errors.city && <p className={errorStyle}>{errors.city.message}</p>}
            </div>
            <div>
              <label className={`${labelStyle} mb-1 block`}>Area {required}</label>
              <input
                className={fieldBox}
                {...register("area")}
                placeholder="e.g. Gulberg, DHA Phase 5, Clifton"
              />
              {errors.area && <p className={errorStyle}>{errors.area.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${labelStyle} mb-1 block`}>Room Type {required}</label>
              <select
                className={fieldBox}
                defaultValue=""
                onChange={(e) => setValue("room_type", e.target.value as ListingFormData["room_type"])}
              >
                <option value="" disabled>Select type</option>
                <option value="Single Room">Single Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Full Apartment">Full Apartment</option>
              </select>
              {errors.room_type && <p className={errorStyle}>{errors.room_type.message}</p>}
            </div>
            <div>
              <label className={`${labelStyle} mb-1 block`}>Monthly Rent {required}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-mono text-[#3e4947]">Rs</span>
                <input
                  type="number"
                  className={`${fieldBox} pl-8`}
                  {...register("monthly_rent")}
                  placeholder="e.g. 45000"
                />
              </div>
              {errors.monthly_rent && <p className={errorStyle}>{errors.monthly_rent.message}</p>}
            </div>
          </div>

          {serverError && (
            <p className="text-[13px] text-red-500 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#00685f] hover:bg-[#00534c] disabled:opacity-60 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] font-medium transition-colors"
          >
            {isSubmitting ? "Posting..." : (
              <>
                Post Listing <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
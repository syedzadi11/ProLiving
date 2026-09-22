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
import {
  Camera, Building2, Send, Inbox, ChevronRight, Coins,
  Eye, EyeOff, Check, LogOut, Trash2,
} from "lucide-react";
import Link from "next/link";

const fieldBox = "bg-white border border-[#dae2fd] rounded-[4px] px-3 py-2.5 outline-none w-full text-[14px] text-[#131b2e] focus:border-[#00685f]";
const labelStyle = "text-[13px] font-medium text-[#131b2e] mb-1.5 block";
const errorStyle = "text-[13px] text-red-500 mt-1";

function initialsOf(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, isLoading: authLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(data?.user.profile_photo ? null : photoPreview);
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

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put("/users/me/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.message || "Could not update password.");
      } else {
        setPasswordError("Could not update password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "This permanently deletes your profile, active listings, and sent connection requests. This cannot be undone. Continue?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.delete("/users/me");
      toast.success("Your account has been deleted.");
      logout();
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Could not delete account.");
      } else {
        toast.error("Could not delete account.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (authLoading || !token || isLoading) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  const listingsCount = myListings?.listings.length ?? 0;
  const sentCount = myRequests?.requests.length ?? 0;
  const incomingCount = incomingRequests?.requests.length ?? 0;

  const activityLinks = [
    {
      href: "/dashboard/my-listings",
      icon: Building2,
      title: "My Listings",
      subtitle: `${listingsCount} Active Listing${listingsCount === 1 ? "" : "s"}`,
    },
    {
      href: "/dashboard/my-requests",
      icon: Send,
      title: "My Requests",
      subtitle: `${sentCount} Sent Request${sentCount === 1 ? "" : "s"}`,
    },
    {
      href: "/dashboard/incoming-requests",
      icon: Inbox,
      title: "Incoming Requests",
      subtitle: `${incomingCount} Pending Inquir${incomingCount === 1 ? "y" : "ies"}`,
    },
  ];

  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-[24px] font-bold text-[#131b2e] tracking-tight">Profile & Account</h1>
        <p className="text-[13px] text-[#515f74] mt-1 mb-8">
          Manage your personal information, contact coordinates, and account security.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Personal & Contact Information */}
            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6">
              <h2 className="text-[16px] font-semibold text-[#131b2e]">
                Personal & Contact Information
              </h2>
              <p className="text-[13px] text-[#515f74] mt-1 mb-6">
                Information used to communicate during active rental agreements and inquiries.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#00685f] flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[18px] font-semibold">
                        {initialsOf(data?.user.full_name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#00685f] cursor-pointer hover:underline">
                        <Camera className="w-3.5 h-3.5" />
                        Change Photo
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                      {photoFile && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="text-[13px] font-medium text-[#ba1a1a] hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6e7977] mt-1">
                      Allowed formats: JPG, PNG or WEBP. Max size: 5MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className={labelStyle}>Full Name</label>
                    <input className={fieldBox} {...register("full_name")} />
                    {errors.full_name && <p className={errorStyle}>{errors.full_name.message}</p>}
                  </div>

                  <div>
                    <label className={labelStyle}>Email Address</label>
                    <input
                      value={data?.user.email ?? ""}
                      disabled
                      className={`${fieldBox} bg-[#f2f3ff66] text-[#515f74] cursor-not-allowed`}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>Phone Number (Pakistan)</label>
                    <input className={fieldBox} {...register("phone")} />
                    {errors.phone && <p className={errorStyle}>{errors.phone.message}</p>}
                    <p className="text-[12px] text-[#6e7977] mt-1.5">
                      Shared with owners or seekers only when a connection request is accepted.
                    </p>
                  </div>

                  <div>
                    <label className={labelStyle}>Primary City</label>
                    <select className={fieldBox} {...register("city")}>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                    </select>
                    {errors.city && <p className={errorStyle}>{errors.city.message}</p>}
                  </div>
                </div>

                {serverError && (
                  <p className="text-[13px] text-red-500 text-center">{serverError}</p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 bg-[#00685f] hover:bg-[#00534c] disabled:opacity-60 rounded-[4px] flex items-center gap-1.5 text-white text-[13px] font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {isSubmitting ? "Saving..." : "Save Profile Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Password & Security (UI only — no backend endpoint yet) */}
            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6">
              <h2 className="text-[16px] font-semibold text-[#131b2e]">Password & Security</h2>
              <p className="text-[13px] text-[#515f74] mt-1 mb-6">
                Ensure your account uses a secure password to safeguard active listings and inquiries.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className={labelStyle}>Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`${fieldBox} pr-10`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8891ab]"
                      tabIndex={-1}
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className={labelStyle}>New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`${fieldBox} pr-10`}
                        placeholder="Minimum 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8891ab]"
                        tabIndex={-1}
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelStyle}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={fieldBox}
                      placeholder="Re-type new password"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-[13px] text-red-500">{passwordError}</p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="h-10 px-5 bg-[#eaedff] hover:bg-[#dae2fd] disabled:opacity-60 rounded-[4px] text-[13px] font-medium text-[#131b2e] transition-colors"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-semibold text-[#131b2e]">Platform Activity</h2>
                <span className="text-[11px] font-semibold text-[#0f7a4e] bg-[#e2f7ee] px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex flex-col mt-4 -mx-2">
                {activityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-2 py-3 rounded-[6px] hover:bg-[#f2f3ff66] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-[#00685f]" />
                      </span>
                      <div>
                        <p className="text-[14px] font-medium text-[#131b2e]">{item.title}</p>
                        <p className="text-[12px] text-[#515f74]">{item.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8891ab]" />
                  </Link>
                ))}
              </div>

              <div className="flex items-start gap-2.5 bg-[#f2f3ff] rounded-[8px] p-3 mt-4">
                <Coins className="w-4 h-4 text-[#515f74] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#515f74]">
                    Account Currency
                  </p>
                  <p className="text-[14px] font-semibold text-[#131b2e]">Pakistani Rupee (Rs)</p>
                  <p className="text-[12px] text-[#515f74] mt-0.5">
                    All rental splits and rent ceilings operate in Rs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] p-6">
              <h2 className="text-[16px] font-semibold text-[#131b2e] mb-4">Account Management</h2>

              <button
                onClick={handleLogout}
                className="w-full h-10 bg-[#f2f3ff] hover:bg-[#eaedff] rounded-[4px] flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#131b2e] transition-colors mb-4"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out of Session
              </button>

              <div className="bg-red-50 border border-red-100 rounded-[8px] p-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#ba1a1a] disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
                <p className="text-[12px] text-[#8a4a4a] mt-1.5">
                  Permanently removes your profile, active listings, and sent connection applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
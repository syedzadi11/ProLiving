

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { signupSchema, SignupFormData } from "@/lib/validations/auth";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(formData: SignupFormData) {
    setServerError("");
    try {
      const res = await api.post<AuthResponse>("/auth/signup", formData);
      login(res.data.user, res.data.token);
      toast.success("Account created! Welcome to ProLiving.");
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="flex justify-center py-16 px-4 bg-gray-50 min-h-[calc(100vh-57px)]">
      <Card className="w-full max-w-md h-fit p-8">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 text-gray-900">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join ProLiving to post listings and request rooms
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</Label>
            <Input id="full_name" {...register("full_name")} placeholder="e.g. Jannah Syeda" className="bg-gray-50 border-gray-200 focus-visible:ring-teal-600/40" />
            {errors.full_name && (
              <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</Label>
            <Input id="email" {...register("email")} placeholder="you@example.com" className="bg-gray-50 border-gray-200 focus-visible:ring-teal-600/40" />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number</Label>
            <Input id="phone" {...register("phone")} placeholder="+92 300 1234567" className="bg-gray-50 border-gray-200 focus-visible:ring-teal-600/40" />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1.5 block">City</Label>
            <Input id="city" {...register("city")} placeholder="e.g. Lahore, Karachi, Islamabad" className="bg-gray-50 border-gray-200 focus-visible:ring-teal-600/40" />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5 block">Create Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="At least 8 characters"
                className="pr-10 bg-gray-50 border-gray-200 focus-visible:ring-teal-600/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-700 font-medium">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
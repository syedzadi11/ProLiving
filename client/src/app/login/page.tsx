"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(formData: LoginFormData) {
    setServerError("");
    try {
      const res = await api.post<AuthResponse>("/auth/login", formData);
      login(res.data.user, res.data.token);
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Login failed. Please try again.");
      } else {
        setServerError("Login failed. Please try again.");
      }
    }
  }

  return (
    <div className="flex justify-center pt-16 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to continue to ProLiving
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal-600 font-medium">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}


"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { UserProfileResponse } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { PlusCircle, Menu, UserRound, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: profileData } = useQuery<UserProfileResponse>({
    queryKey: ["my-profile"],
    queryFn: () => api.get("/users/me").then((res) => res.data),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const photoUrl = getImageUrl(profileData?.user.profile_photo);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  const dashboardLinks = [
    { label: "Home", href: "/" },
    { label: "My Listings", href: "/dashboard/my-listings" },
    { label: "My Requests", href: "/dashboard/my-requests" },
    { label: "Incoming Requests", href: "/dashboard/incoming-requests" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          {!isLoading && user && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              {dashboardLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-teal-600">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            <>
              <Link href="/post-listing">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  Post Listing
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center hover:ring-2 hover:ring-teal-200 transition-all shrink-0">
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserRound className="w-5 h-5 text-gray-400" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <UserRound className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !isLoading && (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-gray-200 h-9 w-9 hover:bg-gray-50">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-10 px-4">
                {!isLoading && user ? (
                  <>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 pb-3 border-b border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserRound className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Profile</span>
                    </Link>

                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-gray-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link href="/post-listing" onClick={() => setOpen(false)}>
                      <Button size="sm" className="w-full gap-1.5">
                        <PlusCircle className="w-4 h-4" />
                        Post Listing
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  !isLoading && (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">Login</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button size="sm" className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
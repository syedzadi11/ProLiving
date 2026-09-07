"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  const dashboardLinks = [
    { label: "My Listings", href: "/dashboard/my-listings" },
    { label: "My Requests", href: "/dashboard/my-requests" },
    { label: "Incoming Requests", href: "/dashboard/incoming-requests" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Home className="w-5 h-5 text-teal-600" />
          ProLiving
        </Link>

        {/* Desktop links */}
        {!isLoading && user && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {dashboardLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-teal-600">
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            <>
              <Link href="/post-listing">
                <Button size="sm" className="gap-1.5">
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

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-gray-200 h-9 w-9 hover:bg-gray-50">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-10 px-4">
                {!isLoading && user ? (
                  <>
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
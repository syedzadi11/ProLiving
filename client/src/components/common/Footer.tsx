


import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Logo size="sm" />
          <span className="text-gray-300">·</span>
          <span>Role-agnostic room rental & roommate-finder platform</span>
        </div>
        <Link href="/post-listing" className="text-sm text-teal-700 font-medium hover:underline">
          Post a Listing
        </Link>
      </div>
    </footer>
  );
}
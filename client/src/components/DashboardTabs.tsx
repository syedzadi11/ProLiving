"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "My Listings", href: "/dashboard/my-listings" },
  { label: "My Requests", href: "/dashboard/my-requests" },
  { label: "Incoming Requests", href: "/dashboard/incoming-requests" },
];

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            pathname === tab.href
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
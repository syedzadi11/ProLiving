


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
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
            pathname === tab.href
              ? "bg-[#00685f] text-white"
              : "bg-[#f2f3ff] text-[#515f74] hover:bg-[#eaedff]"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
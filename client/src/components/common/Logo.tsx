import Link from "next/link";
import { Home } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const badge = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const icon = size === "sm" ? "w-4 h-4" : "w-4.5 h-4.5";
  const text = size === "sm" ? "text-base" : "text-lg";

  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className={`${badge} rounded-md bg-teal-700 flex items-center justify-center shrink-0`}>
        <Home className={`${icon} text-white`} />
      </span>
      <span className={`${text} font-bold text-gray-900`}>ProLiving</span>
    </Link>
  );
}
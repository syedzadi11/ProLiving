import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
        <Home className="w-7 h-7 text-teal-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">404 — Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
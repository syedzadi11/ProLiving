import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ListingCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-20 rounded-full mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </Card>
  );
}
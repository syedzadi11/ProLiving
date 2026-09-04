import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ListRowSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-16 rounded-full mb-2" />
      <Skeleton className="h-5 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </Card>
  );
}
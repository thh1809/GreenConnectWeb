import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-1/4 mb-6" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

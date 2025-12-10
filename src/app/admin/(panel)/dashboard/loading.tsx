import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

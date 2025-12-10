import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

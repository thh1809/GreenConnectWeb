import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricesLoading() {
  return (
    <section className="py-20 px-4 bg-background text-foreground transition-colors duration-300">
      <div className="container max-w-5xl mx-auto pt-10">
        <Card className="border border-border shadow-soft p-8">
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-2/3 mx-auto mb-2" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base md:text-lg">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold">
                    <Skeleton className="h-6 w-32" />
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <Skeleton className="h-6 w-24" />
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <Skeleton className="h-6 w-32" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <Skeleton className="h-5 w-40" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-5 w-28" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-5 w-32" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
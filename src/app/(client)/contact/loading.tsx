import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactLoading() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gradient-secondary-from to-gradient-secondary-to text-foreground transition-colors duration-300">
      <div className="container max-w-3xl mx-auto">
        <Card className="p-8 border border-border shadow-soft animate-fade-in">
          <div className="mb-8">
            <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-12 w-1/2 mx-auto" />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      </div>
    </section>
  );
}
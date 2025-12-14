import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';
import { PAGINATION } from '@/lib/constants';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
};

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between rounded-xl border-border p-5">
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 text-3xl font-semibold">{value}</div>
      </div>
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
    </Card>
  );
}


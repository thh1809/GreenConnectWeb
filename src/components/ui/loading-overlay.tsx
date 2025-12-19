'use client';

import Loading from '@/app/loading';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: 'default' | 'cube' | 'dual-ring' | 'magnetic-dots';
  size?: number;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Đang tải...',
  variant = 'default',
  size = 40,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    // <div
    //   className={cn(
    //     "fixed inset-0 z-[10000] flex items-center justify-center bg-background/80 dark:bg-background/80 backdrop-blur-sm",
    //     className
    //   )}
    //   style={{
    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
    //   }}
    // >
    //   <div className="flex flex-col items-center gap-4 rounded-lg bg-card dark:bg-card border border-border dark:border-border p-8 shadow-lg">
    //     <Loader variant={variant} size={size} />
    //     {message && (
    //       <p className="text-sm font-medium text-foreground dark:text-foreground">
    //         {message}
    //       </p>
    //     )}
    //   </div>
    // </div>
    <Loading />
  );
}

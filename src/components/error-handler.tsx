'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

type ErrorHandlerProps = {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export function ErrorHandler({ error, onRetry, onDismiss }: ErrorHandlerProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Card className="border-danger/50 bg-danger/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-danger" />
          <CardTitle className="text-danger">Lỗi</CardTitle>
        </div>
        <CardDescription className="text-danger/80">{errorMessage}</CardDescription>
      </CardHeader>
      {(onRetry || onDismiss) && (
        <CardContent className="flex gap-2">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Thử lại
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Đóng
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}


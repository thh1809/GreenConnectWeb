'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Calendar, IdCard, User2 } from 'lucide-react';

type VerifyUser = {
  id: string;
  name: string;
  email: string;
  joinDay: string;
};

type VerifyUserDialogProps = {
  user: VerifyUser;
  onVerify?: (id: string) => void;
};

export function VerifyUserDialog({ user, onVerify }: VerifyUserDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="primary" aria-label="Verify">
          <IdCard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-xl p-6 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Verify User Account</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Review the user information and documents before verification.
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Basic info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <User2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm text-muted-foreground">{user.name}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Join day</div>
                <div className="text-sm text-muted-foreground">
                  {user.joinDay}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border" />

          {/* Uploaded documents */}
          <div>
            <div className="px-1 text-sm font-semibold">Uploaded Documents</div>
            <div className="mt-3 space-y-3">
              {['front_id.pdf', 'back_id.pdf', 'image_profile.pdf'].map(
                name => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-md bg-secondary px-4 py-3 text-sm"
                  >
                    <span>{name}</span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Uploaded
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="min-w-28">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="primary"
                className="min-w-28"
                onClick={() => onVerify?.(user.id)}
              >
                Verify User
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

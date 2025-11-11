"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
};

type ComplaintDetail = {
  id: string;
  title: string;
  user: string;
  date: string;
  description: string;
  chatLogs: ChatMessage[];
};

type ComplaintDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: ComplaintDetail | null;
};

export function ComplaintDetailDialog({ open, onOpenChange, complaint }: ComplaintDetailDialogProps) {
  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-0 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Complaints
                </Button>
              </DialogClose>
              <DialogTitle className="text-2xl font-bold">{complaint.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                reported by {complaint.user} on {complaint.date}
              </p>
            </div>
            <Button variant="primary" className="shrink-0">
              Mediate
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Complaint Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Complaint Description</label>
            <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
              {complaint.description}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="evidence">
            <TabsList>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="chat">Chat Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="evidence" className="mt-4">
              <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                No evidence uploaded yet.
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <div className="space-y-4 max-h-[400px] overflow-y-auto rounded-md border border-border bg-muted/30 p-4">
                {complaint.chatLogs.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}


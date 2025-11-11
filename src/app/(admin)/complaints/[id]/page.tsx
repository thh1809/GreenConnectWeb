"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { MediateComplaintDialog } from "@/components/admin/mediate-complaint-dialog";

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

const complaintDetails: Record<string, ComplaintDetail> = {
  "1": {
    id: "1",
    title: "Damaged item received",
    user: "Sarah Johnson",
    date: "2024-03-15",
    description: "I ordered a bamboo toothbrush set but received a damaged package. The items inside were broken and unusable.",
    chatLogs: [
      {
        id: "1",
        sender: "Sarah Johnson",
        message: "Hello, I received my order but it was damaged during shipping.",
        timestamp: "2024-03-15 10:30 AM",
      },
      {
        id: "2",
        sender: "Support Team",
        message: "We apologize for the inconvenience. Could you please share photos of the damaged items?",
        timestamp: "2024-03-15 11:15 AM",
      },
      {
        id: "3",
        sender: "Sarah Johnson",
        message: "I've uploaded the photos. As you can see, the packaging was torn and items are broken.",
        timestamp: "2024-03-15 11:45 AM",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Points not credited",
    user: "Mike Chen",
    date: "2024-03-14",
    description: "I completed several eco-friendly activities but my points were not credited to my account.",
    chatLogs: [
      {
        id: "1",
        sender: "Mike Chen",
        message: "I completed recycling activities but points are missing.",
        timestamp: "2024-03-14 09:00 AM",
      },
      {
        id: "2",
        sender: "Support Team",
        message: "We're looking into this issue. Please provide your account details.",
        timestamp: "2024-03-14 10:30 AM",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Shipping delay",
    user: "Emma Wilson",
    date: "2024-03-13",
    description: "My order was supposed to arrive on March 10th but it's still not here.",
    chatLogs: [
      {
        id: "1",
        sender: "Emma Wilson",
        message: "My order is delayed. When will it arrive?",
        timestamp: "2024-03-13 02:00 PM",
      },
      {
        id: "2",
        sender: "Support Team",
        message: "We've checked and your order is in transit. Expected delivery: March 16th.",
        timestamp: "2024-03-13 03:30 PM",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Wrong item shipped",
    user: "David Brown",
    date: "2024-03-12",
    description: "I ordered a reusable water bottle but received a different product instead.",
    chatLogs: [
      {
        id: "1",
        sender: "David Brown",
        message: "I received the wrong item. What should I do?",
        timestamp: "2024-03-12 11:00 AM",
      },
      {
        id: "2",
        sender: "Support Team",
        message: "We apologize for the error. We'll send the correct item and arrange return pickup.",
        timestamp: "2024-03-12 01:00 PM",
      },
    ],
  },
};

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [mediateDialogOpen, setMediateDialogOpen] = useState(false);
  const { id } = use(params);
  const complaint = complaintDetails[id];

  const handleMediateSubmit = (action: string, notes: string) => {
    console.log("Mediate complaint:", { complaintId: id, action, notes });
    // TODO: Gọi API để xử lý mediate
  };

  if (!complaint) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Complaint Not Found</h1>
          <Link href="/complaints">
            <Button variant="ghost" size="sm" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Link href="/complaints">
            <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>
          <h1 className="text-3xl font-bold leading-tight">{complaint.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            reported by {complaint.user} on {complaint.date}
          </p>
        </div>
        <Button variant="primary" className="shrink-0" onClick={() => setMediateDialogOpen(true)}>
          Mediate
        </Button>
      </div>

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
          <div className="space-y-4 max-h-[500px] overflow-y-auto rounded-md border border-border bg-muted/30 p-4">
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

      {/* Mediate Complaint Dialog */}
      <MediateComplaintDialog
        open={mediateDialogOpen}
        onOpenChange={setMediateDialogOpen}
        onSubmit={handleMediateSubmit}
      />
    </div>
  );
}


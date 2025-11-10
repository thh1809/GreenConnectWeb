"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Priority = "high" | "medium" | "low";
type Status = "pending" | "in-progress" | "resolved";

type Complaint = {
  id: string;
  title: string;
  accused: string;
  user: string;
  priority: Priority;
  status: Status;
  date: string;
};

const complaints: Complaint[] = [
  {
    id: "1",
    title: "Damaged item received",
    accused: "H.hai",
    user: "Sarah Johnson",
    priority: "high",
    status: "pending",
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "Points not credited",
    accused: "H.hai",
    user: "Mike Chen",
    priority: "medium",
    status: "in-progress",
    date: "2024-03-14",
  },
  {
    id: "3",
    title: "Shipping delay",
    accused: "H.hai",
    user: "Emma Wilson",
    priority: "low",
    status: "resolved",
    date: "2024-03-13",
  },
  {
    id: "4",
    title: "Wrong item shipped",
    accused: "H.hai",
    user: "David Brown",
    priority: "high",
    status: "pending",
    date: "2024-03-12",
  },
];

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "high":
      return "bg-danger text-white";
    case "medium":
      return "bg-primary text-primary-foreground";
    case "low":
      return "bg-primary/60 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case "in-progress":
      return "bg-primary text-primary-foreground";
    case "resolved":
      return "bg-primary/60 text-white";
    case "pending":
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold leading-tight">Complaints</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">Manage and resolve user complaints</p>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Filter by Status:</label>
        <Select defaultValue="all">
          <SelectTrigger className="w-40 border-primary">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="h-12 px-4 font-semibold">Title</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Accused</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">User</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Priority</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Status</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Date</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} className="border-b">
                    <TableCell className="px-4 py-4">{complaint.title}</TableCell>
                    <TableCell className="px-4 py-4">{complaint.accused}</TableCell>
                    <TableCell className="px-4 py-4">{complaint.user}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">{complaint.date}</TableCell>
                    <TableCell className="px-4 py-4">
                      <Link href={`/complaints/${complaint.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-primary hover:text-primary hover:underline"
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


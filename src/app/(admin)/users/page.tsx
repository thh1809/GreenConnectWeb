import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Check, Pencil, Search, Trash2 } from "lucide-react";
import { VerifyUserDialog } from "@/components/admin/verify-user-dialog";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Verified" | "Pending";
  joinDay: string;
  updatedAt: string;
};

const users: User[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `${i + 1}`,
  name: "Alex Ha",
  email: "HEHEH@gmail.com",
  role: "Household",
  status: i % 3 === 0 ? "Verified" : "Pending",
  joinDay: "10-10-2026",
  updatedAt: "20-10-2026",
}));

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage user accounts, verification, and access control</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                placeholder="Search by name"
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="household">Household</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join day</TableHead>
                <TableHead>Update At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.status === "Verified"
                          ? "bg-primary text-primary-foreground"
                          : "bg-warning/20 text-warning-update"
                      }`}
                    >
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell>{u.joinDay}</TableCell>
                  <TableCell>{u.updatedAt}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    {u.status === "Pending" ? (
                      <VerifyUserDialog user={{ id: u.id, name: u.name, email: u.email, joinDay: u.joinDay }} />
                    ) : (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">Verified</span>
                    )}
                    <Button size="icon-sm" variant="outline" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon-sm" variant="destructive" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
            <div className="text-xs text-muted-foreground">Show 8 of 100 users</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



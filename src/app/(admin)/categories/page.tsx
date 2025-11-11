"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

type Category = {
  id: string;
  icon: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const categories: Category[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `${i + 1}`,
  icon: "recycle",
  name: "Plastic",
  createdAt: "20-10-2030",
  updatedAt: "20-10-2030",
}));

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight">Scrap Categories</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">Review and manage user posts and content</p>
        </div>
        <Button variant="primary" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {/* Category List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Category List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <input
              placeholder="Search by keywords......"
              className="h-9 w-full rounded-md border border-input bg-background pl-3 pr-9 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="h-12 px-4 font-semibold">Icon</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Category name</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Create At</TableHead>
                  <TableHead className="h-12 px-4 font-semibold">Update At</TableHead>
                  <TableHead className="h-12 px-4 text-right font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="border-b">
                    <TableCell className="px-4 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <Trash2 className="h-5 w-5 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium">{category.name}</TableCell>
                    <TableCell className="px-4 py-4">{category.createdAt}</TableCell>
                    <TableCell className="px-4 py-4">{category.updatedAt}</TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon-sm" variant="outline" aria-label="Edit" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon-sm" variant="destructive" aria-label="Delete" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">Show 4 of 100 Category</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="pointer-events-none opacity-50 cursor-not-allowed" />
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


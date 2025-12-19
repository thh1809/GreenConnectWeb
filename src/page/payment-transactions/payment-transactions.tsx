'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import formatDateTimeLocal, { formatDateTimeVN } from '@/helpers/date-time';
import { parsePaymentTransactionStatus } from '@/helpers/parse-status';
import { usePaymentTransactions } from '@/hooks/api/use-payment-transactions';
import { PaymentTransactionStatus } from '@/lib/enum/payment-transaction-enum';

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 500;

/* ===========================
   Utils
=========================== */
const statusColor = (status: string) => {
  switch (status) {
    case PaymentTransactionStatus.Success:
      return 'default';
    case PaymentTransactionStatus.Failed:
      return 'destructive';
    case PaymentTransactionStatus.Pending:
    default:
      return 'secondary';
  }
};

const statusOptions = [
  { label: 'Đang xử lý', value: PaymentTransactionStatus.Pending },
  { label: 'Thành công', value: PaymentTransactionStatus.Success },
  { label: 'Thất bại', value: PaymentTransactionStatus.Failed },
];

const getPageNumbers = (current: number, total: number, delta = 2) => {
  const pages: number[] = [];
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

/* ===========================
   Page
=========================== */
export default function PaymentTransactionsPage() {
  const [pageIndex, setPageIndex] = React.useState(1);
  const [status, setStatus] = React.useState<string | undefined>();
  const [sortByCreatedAt, setSortByCreatedAt] = React.useState(true);

  /* ===== Time ===== */
  const now = React.useMemo(() => new Date(), []);
  const oneYearAgo = React.useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d;
  }, []);

  // raw values (UI)
  const [start, setStart] = React.useState(formatDateTimeLocal(oneYearAgo));
  const [end, setEnd] = React.useState(formatDateTimeLocal(now));

  // debounced values (API)
  const [debouncedStart, setDebouncedStart] = React.useState(start);
  const [debouncedEnd, setDebouncedEnd] = React.useState(end);
  const [debouncedStatus, setDebouncedStatus] = React.useState(status);
  const [debouncedSort, setDebouncedSort] = React.useState(sortByCreatedAt);

  /* ===== Debounce ===== */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStart(start);
      setDebouncedEnd(end);
      setDebouncedStatus(status);
      setDebouncedSort(sortByCreatedAt);
      setPageIndex(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [start, end, status, sortByCreatedAt]);

  /* ===== Quick filter ===== */
  const applyQuickFilter = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    setStart(formatDateTimeLocal(from));
    setEnd(formatDateTimeLocal(to));
  };

  const { data, isLoading, isError, error } = usePaymentTransactions({
    pageIndex,
    pageSize: PAGE_SIZE,
    start: debouncedStart,
    end: debouncedEnd,
    status: debouncedStatus,
    sortByCreatedAt: debouncedSort,
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-3xl font-semibold">Lịch sử giao dịch thanh toán</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý lịch sử giao dịch thanh toán
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {/* ================= Filters ================= */}
        <div className="px-6 py-4 space-y-4">
          <h1 className="text-2xl font-semibold">
            Danh sách lịch sử giao dịch
          </h1>
          {/* Quick filter */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyQuickFilter(7)}
            >
              7 ngày
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyQuickFilter(30)}
            >
              30 ngày
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyQuickFilter(365)}
            >
              1 năm
            </Button>
          </div>

          {/* Inputs */}
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Từ ngày
              </label>
              <Input
                type="datetime-local"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-56"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Đến ngày
              </label>
              <Input
                type="datetime-local"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-56"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Trạng thái
              </label>
              <Select
                value={status}
                onValueChange={v => setStatus(v === 'all' ? undefined : v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => setSortByCreatedAt(v => !v)}
              >
                {sortByCreatedAt ? 'Mới nhất' : 'Cũ nhất'}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= Table ================= */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-destructive"
                  >
                    {error?.message || 'Lỗi tải dữ liệu'}
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    Không có giao dịch nào
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map(tx => (
                  <TableRow key={tx.paymentId}>
                    <TableCell className="font-mono">
                      #{tx.paymentId.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{tx.user.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.user.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{tx.package.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.package.packageType === 'Freemium'
                          ? 'Gói Freemium'
                          : `${tx.package.connectionAmount} kết nối`}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {tx.amount.toLocaleString()} đ
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColor(tx.status)}>
                        {parsePaymentTransactionStatus(tx.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDateTimeVN(new Date(tx.createdAt))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ================= Pagination ================= */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm text-muted-foreground">
              Hiển thị {transactions.length} / {pagination.totalRecords} giao
              dịch
            </span>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setPageIndex(p => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>

                {getPageNumbers(pageIndex, pagination.totalPages).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={pageIndex === p}
                      onClick={e => {
                        e.preventDefault();
                        setPageIndex(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setPageIndex(p => Math.min(pagination.totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

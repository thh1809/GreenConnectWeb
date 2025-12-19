'use client';

import { ArrowDownUp, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatDateTimeVN } from '@/helpers/date-time';
import { usePrices } from '@/hooks/api/use-prices';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

/* ================= CONFIG ================= */
const PAGE_SIZE = 8;
const DEBOUNCE_TIME = 400;
const ONE_DAY = 24 * 60 * 60 * 1000;
/* ========================================== */

/* ===== Helper: normalize search (VN friendly) ===== */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function PriceListClient() {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [now, setNow] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, isError } = usePrices({
    pageSize: 50,
    sortByUpdateAt: true,
  });
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sort') as 'asc' | 'desc') ?? 'desc'
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  /* ================= PRICES (stable reference) ================= */
  const prices = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  /* ================= URL SYNC ================= */
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (sortOrder) params.set('sort', sortOrder);
    if (page > 1) params.set('page', page.toString());

    router.replace(`?${params.toString()}`);
  }, [search, sortOrder, page, router]);
  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, DEBOUNCE_TIME);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= CURRENT TIME (safe) ================= */
  useEffect(() => {
    const id = setTimeout(() => {
      setNow(Date.now());
    }, 0);

    return () => clearTimeout(id);
  }, []);

  /* ================= FILTER + SORT ================= */
  const filteredPrices = useMemo(() => {
    if (isLoading) return [];

    const keyword = normalize(debouncedSearch);

    return prices
      .filter(price => {
        if (!keyword) return true;

        const name = normalize(price.scrapCategory?.categoryName ?? '');

        const priceText = price.pricePerKg.toString();

        return name.includes(keyword) || priceText.includes(keyword);
      })
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.pricePerKg - b.pricePerKg
          : b.pricePerKg - a.pricePerKg
      );
  }, [prices, debouncedSearch, sortOrder, isLoading]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredPrices.length / PAGE_SIZE);

  const paginatedPrices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPrices.slice(start, start + PAGE_SIZE);
  }, [filteredPrices, page]);

  /* ================= PRICE STATS ================= */
  const { maxPrice, minPrice } = useMemo(() => {
    if (!prices.length) return { maxPrice: 0, minPrice: 0 };

    return {
      maxPrice: Math.max(...prices.map(p => p.pricePerKg)),
      minPrice: Math.min(...prices.map(p => p.pricePerKg)),
    };
  }, [prices]);

  const isNew = (date: string) => {
    if (!now) return false;
    return now - new Date(date).getTime() < ONE_DAY;
  };

  /* ================= RENDER ================= */
  return (
    <section className="px-4 py-20 bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-foreground transition-colors">
      <div className="container max-w-5xl mx-auto pt-10">
        <Card className="border border-border shadow-soft">
          {/* ===== HEADER ===== */}
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Bảng giá tham khảo
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tham khảo giá các loại phế liệu mới nhất, cập nhật liên tục
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ===== TOOLBAR ===== */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Tìm kiếm loại phế liệu hoặc giá..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-[360px]"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))
                  }
                >
                  <ArrowDownUp className="w-4 h-4 mr-2" />
                  Giá {sortOrder === 'asc' ? 'Tăng' : 'Giảm'}
                </Button>

                {search && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearch('')}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>

            {/* ===== MOBILE ===== */}
            <div className="grid gap-4 sm:hidden">
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}

              {!isLoading &&
                !isError &&
                paginatedPrices.map(price => (
                  <Card key={price.referencePriceId} className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {price.scrapCategory?.categoryName ?? 'Không xác định'}
                      </span>
                      {isNew(price.lastUpdated) && (
                        <Badge variant="secondary">Mới</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {price.pricePerKg.toLocaleString('vi-VN')} VNĐ/kg
                      </span>

                      {price.pricePerKg === maxPrice && (
                        <TrendingUp className="w-4 h-4 text-primary" />
                      )}
                      {price.pricePerKg === minPrice && (
                        <TrendingDown className="w-4 h-4 text-danger" />
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDateTimeVN(price.lastUpdated)}
                    </div>
                  </Card>
                ))}
            </div>

            {/* ===== DESKTOP TABLE ===== */}
            <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Loại phế liệu</TableHead>
                    <TableHead>Giá (VNĐ / kg)</TableHead>
                    <TableHead>Cập nhật</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                      </TableRow>
                    ))}

                  {isError && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-danger py-6"
                      >
                        Không thể tải dữ liệu giá
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    !isError &&
                    paginatedPrices.map(price => (
                      <TableRow
                        key={price.referencePriceId}
                        className={cn(
                          isNew(price.lastUpdated) && 'bg-secondary/50'
                        )}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {price.scrapCategory?.categoryName ??
                              'Không xác định'}
                            {isNew(price.lastUpdated) && (
                              <Badge variant="secondary">Mới</Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-light-dark-default text-primary font-semibold">
                              {price.pricePerKg.toLocaleString('vi-VN')}
                            </Badge>

                            {price.pricePerKg === maxPrice && (
                              <TrendingUp className="w-4 h-4 text-primary" />
                            )}
                            {price.pricePerKg === minPrice && (
                              <TrendingDown className="w-4 h-4 text-danger" />
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTimeVN(price.lastUpdated)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && filteredPrices.length > 0 && (
              <Pagination className="justify-center pt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

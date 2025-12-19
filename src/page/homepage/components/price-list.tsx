'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTimeVN } from '@/helpers/date-time';
import { usePrices } from '@/hooks/api/use-prices';
import Link from 'next/link';

export default function PriceList() {
  const { data, isLoading, isError } = usePrices({
    pageSize: 5,
    sortByUpdateAt: true,
  });
  const prices = data?.data || [];

  return (
    <section
      id="price-list"
      className="py-24 px-4 bg-background text-foreground transition-colors duration-300"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Bảng giá tham khảo mới nhất
          </h2>
          <p className="text-xl text-muted-foreground mx-auto ">
            Bảng giá được cập nhật thường xuyên để bạn tham khảo
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 bg-card text-card-foreground border border-border shadow-soft animate-fade-in">
            <div className="flex items-center justify-end mb-4">
              <Button asChild variant="primary" size="sm">
                <Link href="/prices">Xem tất cả</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-base md:text-lg">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-semibold">
                      Loại phế liệu
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Giá (VNĐ/kg)
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Cập nhật
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-40" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-32" />
                        </td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-destructive py-6 text-lg"
                      >
                        Không thể tải dữ liệu giá
                      </td>
                    </tr>
                  ) : prices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-muted-foreground py-6 text-lg"
                      >
                        Chưa có dữ liệu giá
                      </td>
                    </tr>
                  ) : (
                    prices.map(price => (
                      <tr
                        key={price.referencePriceId}
                        className="border-b last:border-0"
                      >
                        <td className="py-3 px-4 font-medium">
                          {price.scrapCategory?.categoryName || 'Không xác định'}
                        </td>
                        <td className="py-3 px-4 text-primary font-semibold">
                          {price.pricePerKg.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {formatDateTimeVN(price.lastUpdated)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

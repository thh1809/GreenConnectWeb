'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LineAreaChart } from '@/page/admin/components/line-area-chart'
import { PieChart } from '@/page/admin/components/pie-chart'
import { BarChart } from '@/page/admin/components/bar-chart'
import { StatCard } from '@/page/admin/components/stat-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  AlarmClock,
  AlertTriangle,
  CheckCheck,
  Gift,
  Users,
  FileText,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react'
import { reports as reportsApi, type ReportResponse } from '@/lib/api/reports'

export default function DashboardPage() {
  const [reportData, setReportData] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Date range state
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: { start?: string; end?: string } = {}
      if (startDate) {
        params.start = new Date(startDate).toISOString()
      }
      if (endDate) {
        params.end = new Date(endDate).toISOString()
      }
      
      const response = await reportsApi.getReport(params)
      setReportData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    // Set default date range: last 30 days
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    
    setEndDate(end.toISOString().slice(0, 16))
    setStartDate(start.toISOString().slice(0, 16))
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport()
    }
  }, [startDate, endDate, fetchReport])

  const handleRefresh = () => {
    fetchReport()
  }

  // Prepare chart data from transaction status
  const transactionChartData = reportData?.transactionStatus.map((status, index) => ({
    label: status.transactionStatus,
    value: status.totalTransactionStatus,
  })) || []

  // Prepare pie chart data
  const pieChartData = reportData?.transactionStatus.map((status, index) => ({
    label: status.transactionStatus,
    value: status.totalTransactionStatus,
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Báo cáo tổng hợp hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Lọc theo khoảng thời gian</CardTitle>
          <CardDescription className="text-sm">
            Chọn khoảng thời gian để xem báo cáo chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Từ ngày
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                Đến ngày
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : reportData ? (
        <>
          {/* Main Stats Cards - Top Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng vật phẩm đổi thưởng
                    </p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalRewardItems}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-background to-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Khiếu nại đang xử lý
                    </p>
                    <p className="text-3xl font-bold mt-2">{reportData.activityComplaint}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-background to-success/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng bài đăng</p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalPost}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-background to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
                    <p className="text-3xl font-bold mt-2">{reportData.totalAllUsers}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Tổng quan giao dịch</CardTitle>
              <CardDescription>Thống kê tổng số giao dịch trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng giao dịch</p>
                    <p className="text-2xl font-bold">{reportData.totalTransaction}</p>
                  </div>
                </div>
                {reportData.transactionStatus.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <AlarmClock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {status.transactionStatus}
                      </p>
                      <p className="text-2xl font-bold">{status.totalTransactionStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pie Chart - Transaction Status Distribution */}
            {pieChartData.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Phân bổ trạng thái giao dịch
                  </CardTitle>
                  <CardDescription>
                    Tỷ lệ các trạng thái giao dịch trong hệ thống
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-6">
                    <PieChart data={pieChartData} size={250} />
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {pieChartData.map((item, index) => {
                        const percentage =
                          reportData.totalTransaction > 0
                            ? ((item.value / reportData.totalTransaction) * 100).toFixed(1)
                            : '0'
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                          >
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{
                                backgroundColor: `hsl(var(--primary))`,
                                opacity: 0.8 - index * 0.1,
                              }}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.value} ({percentage}%)
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bar Chart - Transaction Status */}
            {transactionChartData.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Thống kê trạng thái giao dịch
                  </CardTitle>
                  <CardDescription>
                    Biểu đồ cột thể hiện số lượng giao dịch theo từng trạng thái
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <BarChart data={transactionChartData} height={300} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Line Chart - Transaction Trends */}
          {transactionChartData.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Xu hướng trạng thái giao dịch
                </CardTitle>
                <CardDescription>
                  Biểu đồ đường thể hiện xu hướng các trạng thái giao dịch
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <LineAreaChart data={transactionChartData} height={300} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu báo cáo
        </div>
      )}
    </div>
  )
}


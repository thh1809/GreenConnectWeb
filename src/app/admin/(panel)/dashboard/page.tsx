import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LineAreaChart } from '@/page/admin/components/line-area-chart'
import { StatCard } from '@/page/admin/components/stat-card'
import { AlarmClock, AlertTriangle, CheckCheck, Gift } from 'lucide-react'

const mock = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 25 },
  { label: 'Fri', value: 22 },
  { label: 'Sat', value: 18 },
  { label: 'Sun', value: 14 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to EcoRewards Management
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rewards"
          value={24}
          icon={<Gift className="h-5 w-5" />}
        />
        <StatCard
          title="Active Complaints"
          value={24}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          title="Pending"
          value={24}
          icon={<AlarmClock className="h-5 w-5" />}
        />
        <StatCard
          title="Resolved"
          value={24}
          icon={<CheckCheck className="h-5 w-5" />}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Complainment Trends</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <LineAreaChart data={mock} />
        </CardContent>
      </Card>
    </div>
  )
}


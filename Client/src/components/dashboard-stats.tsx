import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Cpu, HardDrive, Activity } from "lucide-react";
import type { DashboardData } from "@/hooks/use-websocket";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Users"
        value={data.activeUsers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="CPU Usage"
        value={data.cpuUsage}
        icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Memory Usage"
        value={data.memoryUsage}
        icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Request Count"
        value={data.requestCount}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { DashboardData } from '@/hooks/use-websocket';

interface DataVisualizationProps {
  data: DashboardData[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DataVisualization({ data }: DataVisualizationProps) {
  const formattedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      time: new Date(d.timestamp).toLocaleTimeString(),
      date: new Date(d.timestamp).toLocaleDateString(),
    }));
  }, [data]);

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'CPU Usage', 'Memory Usage', 'Active Users', 'Request Count'].join(','),
      ...formattedData.map(row => [
        `${row.date} ${row.time}`,
        row.cpuUsage,
        row.memoryUsage,
        row.activeUsers,
        row.requestCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard_metrics_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Metrics</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ 
                  value: 'Values', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpuUsage"
                name="CPU Usage"
                stroke="hsl(var(--chart-1))"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="memoryUsage"
                name="Memory Usage"
                stroke="hsl(var(--chart-2))"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke="hsl(var(--chart-3))"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="requestCount"
                name="Request Count"
                stroke="hsl(var(--chart-4))"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
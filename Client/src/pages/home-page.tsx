import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket, type DashboardData } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { DataVisualization } from "@/components/data-visualization";
import { DashboardStats } from "@/components/dashboard-stats";
import { AlertSettings } from "@/components/alert-settings";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Settings } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AlertThresholds {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  requestCount: number;
}

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: liveData, isConnected } = useWebSocket();
  const [historicalData, setHistoricalData] = useState<DashboardData[]>([]);
  const [alertThresholds, setAlertThresholds] = useState<AlertThresholds>({
    cpuUsage: 95,
    memoryUsage: 95,
    activeUsers: 100,
    requestCount: 1000,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (liveData) {
      setHistoricalData((prev) => {
        const newData = [...prev, liveData];
        return newData.slice(-30); // Keep last 30 data points
      });

      // Check for threshold violations
      if (liveData.cpuUsage > alertThresholds.cpuUsage) {
        toast({
          title: "High CPU Usage Alert",
          description: `CPU usage has exceeded ${alertThresholds.cpuUsage}%`,
          variant: "destructive",
        });
      }
      if (liveData.memoryUsage > alertThresholds.memoryUsage) {
        toast({
          title: "High Memory Usage Alert",
          description: `Memory usage has exceeded ${alertThresholds.memoryUsage}%`,
          variant: "destructive",
        });
      }
      if (liveData.activeUsers > alertThresholds.activeUsers) {
        toast({
          title: "High User Load Alert",
          description: `Active users have exceeded ${alertThresholds.activeUsers}`,
          variant: "destructive",
        });
      }
      if (liveData.requestCount > alertThresholds.requestCount) {
        toast({
          title: "High Request Count Alert",
          description: `Request count has exceeded ${alertThresholds.requestCount}`,
          variant: "destructive",
        });
      }
    }
  }, [liveData, alertThresholds, toast]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.username}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <ThemeToggle />
            <Link href="/account">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Account
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {liveData && <DashboardStats data={liveData} />}
          {historicalData.length > 0 && (
            <DataVisualization data={historicalData} />
          )}
          <AlertSettings onThresholdsChange={setAlertThresholds} />
        </div>
      </main>
    </div>
  );
}
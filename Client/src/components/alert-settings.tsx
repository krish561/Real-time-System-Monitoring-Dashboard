import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertThresholds {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  requestCount: number;
}

interface AlertSettingsProps {
  onThresholdsChange: (thresholds: AlertThresholds) => void;
}

export function AlertSettings({ onThresholdsChange }: AlertSettingsProps) {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState<AlertThresholds>({
    cpuUsage: 95,
    memoryUsage: 95,
    activeUsers: 100,
    requestCount: 1000,
  });

  const handleChange = (metric: keyof AlertThresholds, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setThresholds(prev => ({
        ...prev,
        [metric]: numValue
      }));
    }
  };

  const handleSave = () => {
    onThresholdsChange(thresholds);
    toast({
      title: "Alert thresholds updated",
      description: "You will be notified when metrics exceed these thresholds.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Alert Settings
        </CardTitle>
        <CardDescription>
          Set thresholds for system metrics. You'll be notified when these values are exceeded.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpuUsage">CPU Usage (%)</Label>
            <Input
              id="cpuUsage"
              type="number"
              min="0"
              max="100"
              value={thresholds.cpuUsage}
              onChange={(e) => handleChange("cpuUsage", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memoryUsage">Memory Usage (%)</Label>
            <Input
              id="memoryUsage"
              type="number"
              min="0"
              max="100"
              value={thresholds.memoryUsage}
              onChange={(e) => handleChange("memoryUsage", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeUsers">Active Users</Label>
            <Input
              id="activeUsers"
              type="number"
              min="0"
              value={thresholds.activeUsers}
              onChange={(e) => handleChange("activeUsers", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestCount">Request Count</Label>
            <Input
              id="requestCount"
              type="number"
              min="0"
              value={thresholds.requestCount}
              onChange={(e) => handleChange("requestCount", e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Alert Settings
        </Button>
      </CardContent>
    </Card>
  );
}
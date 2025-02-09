import { useEffect, useRef, useState } from 'react';

export type DashboardData = {
  timestamp: string;
  activeUsers: number;
  cpuUsage: number;
  memoryUsage: number;
  requestCount: number;
};

export function useWebSocket() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { data, isConnected };
}
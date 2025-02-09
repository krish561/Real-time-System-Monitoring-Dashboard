import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function getSystemMetrics() {
  try {
    // Get CPU usage using mpstat
    const { stdout: cpuOutput } = await execAsync("mpstat 1 1 | grep 'all' | awk '{print 100-$NF}'");
    const cpuUsage = parseFloat(cpuOutput);

    // Get memory usage using free command
    const { stdout: memOutput } = await execAsync("free | grep Mem | awk '{print $3/$2 * 100.0}'");
    const memoryUsage = parseFloat(memOutput);

    return {
      cpuUsage: Math.round(cpuUsage),
      memoryUsage: Math.round(memoryUsage)
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return {
      cpuUsage: 0,
      memoryUsage: 0
    };
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);
  const httpServer = createServer(app);

  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    clientTracking: true 
  });

  let totalRequests = 0;

  // Middleware to track request count
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      totalRequests++;
    }
    next();
  });

  // Generate metrics with real system data
  const generateMetrics = async () => {
    const systemMetrics = await getSystemMetrics();

    const metrics = {
      activeUsers: wss.clients.size,
      cpuUsage: systemMetrics.cpuUsage,
      memoryUsage: systemMetrics.memoryUsage,
      requestCount: totalRequests
    };

    // Store metrics in database
    const storedMetrics = await storage.recordMetrics(metrics);
    return storedMetrics;
  };

  wss.on('listening', () => {
    console.log('WebSocket server is listening');
  });

  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  // Add REST endpoint for historical data
  app.get("/api/metrics/history", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
      const metrics = await storage.getLatestMetrics(limit);
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Broadcast data to all connected clients
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    console.log(`Active connections: ${wss.clients.size}`);

    // Send initial data
    generateMetrics().then(data => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(data));
        } catch (error) {
          console.error('Error sending initial data:', error);
        }
      }
    });

    // Send updates every 2 seconds
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        generateMetrics().then(data => {
          try {
            ws.send(JSON.stringify(data));
          } catch (error) {
            console.error('Error sending update:', error);
          }
        });
      }
    }, 2000);

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected from WebSocket');
      console.log(`Active connections: ${wss.clients.size}`);
    });
  });

  return httpServer;
}
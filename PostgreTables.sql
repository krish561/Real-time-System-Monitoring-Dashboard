## Database Schema

### Users Table

users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


### System Metrics Table

systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  cpuUsage: integer("cpu_usage").notNull(),
  memoryUsage: integer("memory_usage").notNull(),
  activeUsers: integer("active_users").notNull(),
  requestCount: integer("request_count").notNull(),
});
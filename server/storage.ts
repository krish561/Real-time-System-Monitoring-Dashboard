import { users, systemMetrics, type User, type InsertUser, type SystemMetric } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  recordMetrics(metrics: Omit<SystemMetric, "id" | "timestamp">): Promise<SystemMetric>;
  getLatestMetrics(limit: number): Promise<SystemMetric[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async recordMetrics(metrics: Omit<SystemMetric, "id" | "timestamp">): Promise<SystemMetric> {
    const [recorded] = await db.insert(systemMetrics).values(metrics).returning();
    return recorded;
  }

  async getLatestMetrics(limit: number): Promise<SystemMetric[]> {
    return await db
      .select()
      .from(systemMetrics)
      .orderBy(systemMetrics.timestamp)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
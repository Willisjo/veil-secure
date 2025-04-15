import { db } from './db';
import { 
  users, 
  servers, 
  sessions, 
  payments,
  type InsertUser,
  type InsertServer,
  type InsertSession,
  type InsertPayment
} from '../shared/schema';
import { eq, and, desc } from 'drizzle-orm';

// User Operations
export const createUser = async (userData: InsertUser) => {
  return await db.insert(users).values(userData).returning();
};

export const getUsers = async () => {
  return await db.select().from(users);
};

export const getUserById = async (id: number) => {
  return await db.select().from(users).where(eq(users.id, id));
};

export const updateUser = async (id: number, userData: Partial<InsertUser>) => {
  return await db
    .update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
};

export const deleteUser = async (id: number) => {
  return await db.delete(users).where(eq(users.id, id)).returning();
};

// Server Operations
export const createServer = async (serverData: InsertServer) => {
  return await db.insert(servers).values(serverData).returning();
};

export const getServers = async () => {
  return await db.select().from(servers);
};

export const getServerById = async (id: number) => {
  return await db.select().from(servers).where(eq(servers.id, id));
};

export const updateServer = async (id: number, serverData: Partial<InsertServer>) => {
  return await db
    .update(servers)
    .set({ ...serverData, updatedAt: new Date() })
    .where(eq(servers.id, id))
    .returning();
};

export const deleteServer = async (id: number) => {
  return await db.delete(servers).where(eq(servers.id, id)).returning();
};

// Session Operations
export const createSession = async (sessionData: InsertSession) => {
  return await db.insert(sessions).values(sessionData).returning();
};

export const getSessions = async () => {
  return await db.select().from(sessions).orderBy(desc(sessions.startTime));
};

export const getSessionById = async (id: number) => {
  return await db.select().from(sessions).where(eq(sessions.id, id));
};

export const getSessionsByUserId = async (userId: number) => {
  return await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(desc(sessions.startTime));
};

export const updateSession = async (id: number, sessionData: Partial<InsertSession>) => {
  return await db
    .update(sessions)
    .set(sessionData)
    .where(eq(sessions.id, id))
    .returning();
};

export const endSession = async (id: number) => {
  return await db
    .update(sessions)
    .set({ 
      endTime: new Date(),
      status: 'disconnected'
    })
    .where(eq(sessions.id, id))
    .returning();
};

// Payment Operations
export const createPayment = async (paymentData: InsertPayment) => {
  return await db.insert(payments).values(paymentData).returning();
};

export const getPayments = async () => {
  return await db.select().from(payments).orderBy(desc(payments.createdAt));
};

export const getPaymentsByUserId = async (userId: number) => {
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
};

// Analytics and Stats
export const getActiveSessionsCount = async () => {
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.status, 'connected'));
  return result.length;
};

export const getServerStats = async (serverId: number) => {
  const result = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.serverId, serverId),
        eq(sessions.status, 'connected')
      )
    );
  return {
    activeConnections: result.length,
    // Additional stats could be calculated here
  };
};
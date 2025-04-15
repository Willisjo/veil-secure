import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  boolean, 
  integer,
  varchar,
  json 
} from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull(),
  isAdmin: boolean('is_admin').default(false),
  isPremium: boolean('is_premium').default(false),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status').default('inactive'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define User Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  payments: many(payments),
}));

// Server Locations Table
export const servers = pgTable('servers', {
  id: serial('id').primaryKey(),
  country: text('country').notNull(),
  flag: text('flag').notNull(),
  region: text('region').notNull(),
  city: text('city').notNull(),
  ping: integer('ping').notNull(),
  isPremium: boolean('is_premium').default(false),
  hostname: text('hostname'),
  ipAddress: text('ip_address'),
  protocol: text('protocol'),
  port: integer('port'),
  status: text('status').default('online'),
  load: integer('load').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// VPN Sessions Table
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  serverId: integer('server_id').references(() => servers.id),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  bytesUploaded: integer('bytes_uploaded').default(0),
  bytesDownloaded: integer('bytes_downloaded').default(0),
  status: text('status').default('connected'),
  deviceInfo: json('device_info'),
});

// Define Session Relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  server: one(servers, {
    fields: [sessions.serverId],
    references: [servers.id],
  }),
}));

// Payments Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  status: text('status').notNull(),
  planType: text('plan_type').notNull(),
  planDuration: text('plan_duration').notNull(),
  transactionId: text('transaction_id'),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define Payment Relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Server = typeof servers.$inferSelect;
export type InsertServer = typeof servers.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  char,
  datetime,
  index,
  int,
  mysqlTableCreator,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `suji_${name}`);

export const users = mysqlTable(
  "users",
  {
    internalId: int("internal_id").primaryKey().autoincrement(),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    externalIdIdx: index("external_id_idx").on(table.externalId),
  }),
);

export const accounts = mysqlTable(
  "accounts",
  {
    internalId: int("internal_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 120 }),
    userInternalId: int("user_internal_id"),
    publicId: char("public_id", { length: 16 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex("name_idx").on(table.name, table.userInternalId),
    uniquePublicId: uniqueIndex("unique_public_id").on(table.publicId),
  }),
);

export const transactions = mysqlTable(
  "transactions",
  {
    internalId: int("internal_id").primaryKey().autoincrement(),
    summary: varchar("summary", { length: 50 }).notNull(),
    details: text("details"),
    publicId: char("public_id", { length: 16 }).notNull(),
    userInternalId: int("user_internal_id"),
    accountInternalId: int("account_internal_id"),
    date: datetime("date").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    summaryIdx: index("summary_idx").on(table.summary),
    uniquePublicId: uniqueIndex("unique_public_id").on(table.publicId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

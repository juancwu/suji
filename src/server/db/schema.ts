// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  char,
  datetime,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTableCreator,
  double,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const maxCategoryLen = 50;
export const maxSummaryLen = 50;
export const maxAccountNameLen = 50;
export const publicIdLen = 16;

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
    externalIdIdx: uniqueIndex("external_id_idx").on(table.externalId),
  }),
);

export const accounts = mysqlTable(
  "accounts",
  {
    internalId: int("internal_id").primaryKey().autoincrement(),
    name: varchar("name", { length: maxAccountNameLen }).notNull(),
    initial: char("initial", { length: 1 }).notNull(),
    userExternalId: varchar("user_external_id", { length: 255 }),
    publicId: char("public_id", { length: publicIdLen }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    categories: json("categories").$type<string[]>().default([]),
    amount: double("amount").notNull().default(0),
  },
  (table) => ({
    nameIdx: uniqueIndex("name_idx").on(table.name, table.userExternalId),
    uniquePublicId: uniqueIndex("unique_public_id").on(table.publicId),
  }),
);

export type AccountsTable = InferSelectModel<typeof accounts>;

export const insertAccountSchema = createInsertSchema(accounts, {
  categories: z.array(z.string().min(1).max(maxCategoryLen)),
});

export const transactionTypes = ["income", "expense", "transfer"] as const;

type TransactionEnum = typeof transactionTypes;

export type TransactionTypes = TransactionEnum[number];

export const transactions = mysqlTable(
  "transactions",
  {
    internalId: int("internal_id").primaryKey().autoincrement(),
    summary: varchar("summary", { length: maxSummaryLen }).notNull(),
    details: text("details"),
    publicId: char("public_id", { length: publicIdLen }).notNull(),
    userExternalId: varchar("user_external_id", { length: 255 }),
    accountInternalId: int("account_internal_id"),
    date: datetime("date").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    type: mysqlEnum("type", transactionTypes).notNull(),
    category: varchar("category", { length: maxCategoryLen }),
    amount: double("amount").notNull().default(0),
  },
  (table) => ({
    summaryIdx: index("summary_idx").on(table.summary),
    typeIdx: index("type_idx").on(table.type),
    categoryIdx: index("category_idx").on(table.category),
    uniquePublicId: uniqueIndex("unique_public_id").on(table.publicId),
  }),
);

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountInternalId],
    references: [accounts.internalId],
  }),
}));

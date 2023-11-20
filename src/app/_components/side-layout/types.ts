import type { AccountsTable } from "@/server/db/schema";

export type Navigation = {
  name: string;
  href: string;
  icon: React.ReactNode;
  current: boolean;
};

export type UserNavigation = {
  name: string;
  href: string;
};

export type Account = Pick<
  AccountsTable,
  "publicId" | "name" | "initial" | "amount"
>;

export type User = {
  imageUrl: string;
  username: string | null;
};

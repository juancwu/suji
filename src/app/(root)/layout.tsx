import { currentUser } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import DesktopSidebar from "@/app/_components/side-layout/desktop-sidebar.server";
import type { Account, User } from "@/app/_components/side-layout/types";

export type Transaction = {
  amount: number;
  date: Date;
  type: "income" | "expense" | "transfer" | null;
};

interface LayoutInterface {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutInterface) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <DesktopSidebar />
      {children}
    </>
  );
}

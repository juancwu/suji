import { currentUser } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import DesktopSidebar from "@/app/_components/side-layout/desktop-sidebar.server";
import type { Account, User } from "@/app/_components/side-layout/types";

export type Transaction = {
  amount: number;
  date: Date;
  type: "income" | "expense" | "transfer" | null;
};

interface LayoutInterface {
  children: React.ReactNode;
  params: {
    user: User;
    accounts: (Account & { transactions: Transaction[] })[];
  };
}

export default async function Layout({ children, params }: LayoutInterface) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const accounts = await db.query.accounts.findMany({
    columns: {
      publicId: true,
      name: true,
      initial: true,
      amount: true,
    },
    with: {
      transactions: {
        columns: {
          amount: true,
          date: true,
          type: true,
        },
        limit: 1,
        orderBy: [desc(transactions.date)],
      },
    },
  });

  params.user = user;
  params.accounts = accounts;

  return (
    <>
      <DesktopSidebar accounts={accounts} />
      <SideLayout
        user={{ username: user.username, imageUrl: user.imageUrl }}
        accounts={accounts}
      >
        {children}
      </SideLayout>
    </>
  );
}

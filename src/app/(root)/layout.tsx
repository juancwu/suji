import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/server/db";
import { accounts as accountsTable } from "@/server/db/schema";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import DesktopSidebar from "@/app/_components/side-layout/desktop-sidebar.server";
import type { Account, User } from "@/app/_components/side-layout/types";

interface LayoutInterface {
  children: React.ReactNode;
  params: {
    user: User;
    accounts: Account[];
  };
}

export default async function Layout({ children, params }: LayoutInterface) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const accounts = await db
    .select({
      publicId: accountsTable.publicId,
      name: accountsTable.name,
      initial: accountsTable.initial,
    })
    .from(accountsTable)
    .where(eq(accountsTable.userExternalId, user.id));

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

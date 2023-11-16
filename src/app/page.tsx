import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { accounts as accountsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import DesktopSidebar from "@/app/_components/side-layout/desktop-sidebar.server";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await db
    .select({
      publicId: accountsTable.publicId,
      name: accountsTable.name,
      initial: accountsTable.initial,
    })
    .from(accountsTable)
    .where(eq(accountsTable.userExternalId, user.id));

  return (
    <>
      {/* Static sidebar for desktop */}
      <DesktopSidebar accounts={accounts} />
      <SideLayout
        user={{ username: user.username, imageUrl: user.imageUrl }}
        accounts={accounts}
      >
        some content
      </SideLayout>
    </>
  );
}

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { accounts as accountsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import DesktopSidebar from "@/app/_components/side-layout/desktop-sidebar.server";
import SectionHeading from "@/app/_components/section-heading.server";
import AccountCard from "@/app/_components/account-card.server";
import Link from "next/link";
import { getButtonStyles } from "./_styles/button.styles";

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
        <section>
          <SectionHeading heading="Accounts" />
          <div className="py-5">
            <Link href="/new-account" className={getButtonStyles()}>
              Create Account
            </Link>
          </div>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
          >
            {accounts.map((account) => (
              <li
                key={account.publicId}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <AccountCard account={account} />
              </li>
            ))}
          </ul>
        </section>
      </SideLayout>
    </>
  );
}

import { desc } from "drizzle-orm";

import SectionHeading from "@/app/_components/section-heading.server";
import AccountCard from "@/app/_components/account-card.server";
import NewAccountModal from "./new-account-modal.client";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";

export default async function Dashboard() {
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

  return (
    <SideLayout>
      <section>
        <SectionHeading heading="Accounts" />
        <div className="py-5">
          <NewAccountModal />
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
  );
}

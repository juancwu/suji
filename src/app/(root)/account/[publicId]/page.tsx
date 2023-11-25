import SectionHeading from "@/app/_components/section-heading.server";
import SideLayout from "@/app/_components/side-layout/side-layout.client";
import Transactions from "@/app/_components/transactions.server";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import NewTransactionModal from "@/app/_components/new-transaction-modal.client";

interface AccountPageProps {
  params: {
    publicId: string;
  };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const account = await db.query.accounts.findFirst({
    with: {
      transactions: {
        orderBy: [desc(transactions.date)],
      },
    },
    where: (accounts, { eq }) => eq(accounts.publicId, params.publicId),
  });

  if (!account) {
    redirect("/dashboard");
  }

  return (
    <SideLayout>
      <section>
        <SectionHeading heading={`Account: ${account.name}`} />
        <div className="pt-5">
          <NewTransactionModal accountPublidId={account.publicId} />
        </div>
        <Transactions accountInternalId={account.internalId} />
      </section>
    </SideLayout>
  );
}

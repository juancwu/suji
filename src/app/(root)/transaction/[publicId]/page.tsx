import SideLayout from "@/app/_components/side-layout/side-layout.client";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { statuses } from "@/app/_styles/tag.styles";
import { formatCurrency } from "@/app/_utils";
import { accounts, publicIdLen, transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getButtonStyles } from "@/app/_styles/button.styles";
import Input from "@/app/_components/input.server";
import { z } from "zod";

interface TransactionPageProps {
  params: {
    publicId: string;
  };
}

export default async function TransactionPage({
  params,
}: TransactionPageProps) {
  // query transaction data
  const data = await db.query.transactions.findFirst({
    columns: {
      accountInternalId: true,
      publicId: true,
      summary: true,
      details: true,
      amount: true,
      createdAt: true,
      updatedAt: true,
      type: true,
      internalId: true,
    },
    where: (trs, { eq }) => eq(trs.publicId, params.publicId),
  });

  if (!data) {
    redirect("/404");
  }

  let account: { name: string; publicId: string; amount: number } | undefined;
  if (data.accountInternalId !== null) {
    account = await db.query.accounts.findFirst({
      columns: {
        publicId: true,
        name: true,
        amount: true,
      },
      where: (acc, { eq }) => eq(acc.internalId, data.accountInternalId),
    });
  }

  async function deleteTransaction(formData: FormData) {
    "use server";
    const result = z
      .string()
      .min(publicIdLen)
      .safeParse(formData.get("transactionId"));
    if (!result.success) {
      return "Invalid value";
    }
    if (!data || !account) return;
    if (result.data !== data.publicId) return "Invalid transaction ID";
    try {
      await db
        .delete(transactions)
        .where(eq(transactions.internalId, data.internalId));
      // update account amount
      await db
        .update(accounts)
        .set({
          amount: account.amount - data.amount,
        })
        .where(eq(accounts.internalId, data.accountInternalId));
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: "Could not delete transaction",
          error: error.message,
        };
      }
    }
    redirect(`/account/${account.publicId}`);
  }

  return (
    <SideLayout>
      <section>
        <ul role="list" className="divide-y divide-gray-200">
          <li className="py-4">
            <h3 className="mb-2 text-lg font-semibold leading-6 text-gray-900">
              Transaction Details
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                Transaction ID:{" "}
                <span className="text-black">{data.publicId}</span>
              </p>
              {account && (
                <p>
                  Account:
                  <Link
                    href={`/account/${account.publicId}`}
                    className="ml-2 text-sky-600 underline"
                  >
                    {account.name}
                  </Link>
                </p>
              )}
              <p>
                Created At:{" "}
                <span className="text-black">
                  {format(data.createdAt, "MMM yy")}
                </span>
              </p>
              <p>
                Amount:{" "}
                <span className={statuses[data.type]}>
                  {formatCurrency(data.amount)}
                </span>
              </p>
              <p>
                Summary: <span className="text-black">{data.summary}</span>
              </p>
              <p>
                Details: <span className="text-black">{data.details}</span>
              </p>
            </div>
          </li>
          <li className="py-4">
            <form action={deleteTransaction} className="space-y-2">
              <Input
                label="Confirm Delete"
                name="transactionId"
                placeholder="Enter transaction ID"
                required
              />
              <button
                type="submit"
                className={getButtonStyles({ intent: "secondary" })}
              >
                Delete Transaction
              </button>
            </form>
          </li>
        </ul>
      </section>
    </SideLayout>
  );
}

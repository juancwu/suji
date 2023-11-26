import { Fragment } from "react";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/20/solid";
import { type InferSelectModel, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { statuses } from "@/app/_styles/tag.styles";
import { classNames, formatCurrency } from "@/app/_utils";
import { db } from "@/server/db";
import { transactions as transactionsTable } from "@/server/db/schema";
import { format } from "date-fns";

export interface TransactionData
  extends Omit<InferSelectModel<typeof transactionsTable>, "amount"> {
  href: string;
  amount: string;
  icon:
    | typeof ArrowsRightLeftIcon
    | typeof ArrowDownCircleIcon
    | typeof ArrowUpCircleIcon;
}

export type TransactionGroup = {
  date: string;
  transactions: TransactionData[];
};

function groupByMonth(
  transactions: InferSelectModel<typeof transactionsTable>[],
) {
  const groupedDates = new Map<
    string,
    InferSelectModel<typeof transactionsTable>[]
  >();
  transactions.forEach((transaction) => {
    const dateKey = format(transaction.date, "yyyy-MM-dd");
    if (!groupedDates.has(dateKey)) {
      groupedDates.set(dateKey, []);
    }
    const group = groupedDates.get(dateKey);
    group!.push(transaction);
  });
  return groupedDates;
}

const transactionIcons = {
  income: ArrowUpCircleIcon,
  expense: ArrowDownCircleIcon,
  transfer: ArrowsRightLeftIcon,
};

function formatTransactions(
  transactions: InferSelectModel<typeof transactionsTable>[],
): TransactionData[] {
  return transactions.map((t) => ({
    ...t,
    href: `/transaction/${t.publicId}`,
    amount: formatCurrency(t.amount),
    icon: transactionIcons[t.type],
  }));
}

export interface TransactionsProps {
  accountInternalId: number;
}

export default async function Transactions({
  accountInternalId,
}: TransactionsProps) {
  const transactions = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.accountInternalId, accountInternalId))
    .orderBy(desc(transactionsTable.date));

  // group by month
  const grouped = groupByMonth(transactions);
  const all: TransactionGroup[] = [];
  grouped.forEach((transactions, date) => {
    all.push({
      date,
      transactions: formatTransactions(transactions),
    });
  });

  return (
    <div>
      <div className="mt-6 overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table className="w-full text-left">
              <thead className="sr-only">
                <tr>
                  <th>Amount</th>
                  <th className="hidden sm:table-cell">Client</th>
                  <th>More details</th>
                </tr>
              </thead>
              <tbody>
                {all.map((day) => (
                  <Fragment key={day.date}>
                    <tr className="text-sm leading-6 text-gray-900">
                      <th
                        scope="colgroup"
                        colSpan={3}
                        className="relative isolate py-2 font-semibold"
                      >
                        <time dateTime={day.date}>{day.date}</time>
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                      </th>
                    </tr>
                    {day.transactions.map((transaction) => (
                      <tr key={transaction.publicId}>
                        <td className="relative py-5 pr-6">
                          <div className="flex gap-x-6">
                            <transaction.icon
                              className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                              aria-hidden="true"
                            />
                            <div className="flex-auto">
                              <div className="flex items-start gap-x-3">
                                <div className="text-sm font-medium leading-6 text-gray-900">
                                  {transaction.amount}
                                </div>
                                <div
                                  className={classNames(
                                    statuses[transaction.type],
                                    "rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset",
                                  )}
                                >
                                  {transaction.type}
                                </div>
                              </div>
                              <div className="mt-1 text-xs leading-5 text-gray-500">
                                {transaction.summary}
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                          <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                        </td>
                        <td className="py-5 text-right">
                          <div className="flex justify-end">
                            <Link
                              href={transaction.href}
                              className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                            >
                              View
                              <span className="hidden sm:inline">
                                {" "}
                                transaction
                              </span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

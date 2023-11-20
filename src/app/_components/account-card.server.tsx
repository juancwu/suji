import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { classNames } from "@/app/_utils";
import type { Account } from "@/app/_components/side-layout/types";

export const statuses = {
  income: "text-green-700 bg-green-50 ring-green-600/20",
  transfer: "text-gray-600 bg-gray-50 ring-gray-500/10",
  expense: "text-red-700 bg-red-50 ring-red-600/10",
  neutral: "",
};

function formatCurrency(value: number, noSign = false) {
  let numStr = Math.abs(value).toFixed(2);
  const parts = numStr.split(".");
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  numStr = parts.join(".");

  const sign = !noSign ? (value < 0 ? "-" : "+") : "";

  return `${sign}\$${numStr}`;
}

type Transaction = {
  amount: number;
  date: Date;
  type: "income" | "expense" | "transfer" | null;
};

type AccountProp = Account & { transactions: Transaction[] };

export default function AccountCard({ account }: { account: AccountProp }) {
  return (
    <>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <CurrencyDollarIcon className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10" />
        <div className="text-sm font-medium leading-6 text-gray-900">
          {account.name}
        </div>
        <div className="ml-auto">
          <Link
            href={`#${account.publicId}`}
            className="-m-2.5 block p-2.5 font-semibold text-indigo-500 hover:underline"
          >
            Manage
          </Link>
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Last transaction</dt>
          <dd className="text-gray-700">
            <time dateTime={account.transactions[0]!.date.toDateString()}>
              {account.transactions[0]!.date.toDateString()}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {/* TODO: format money */}
              {formatCurrency(account.transactions[0]?.amount ?? 0, true)}
            </div>
            <div
              className={classNames(
                statuses[account.transactions[0]?.type ?? "neutral"],
                "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
              )}
            >
              {account.transactions[0]?.type?.toUpperCase()}
            </div>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">In Account</dt>
          <dd className="flex items-start gap-x-2">
            <div
              className={`font-medium ${
                account.amount < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(account.amount)}
            </div>
          </dd>
        </div>
      </dl>
    </>
  );
}

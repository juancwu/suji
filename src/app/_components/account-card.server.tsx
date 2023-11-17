import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { classNames } from "@/app/_utils";
import type { Account } from "@/app/_components/side-layout/types";

export const statuses = {
  Income: "text-green-700 bg-green-50 ring-green-600/20",
  Transfer: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Expense: "text-red-700 bg-red-50 ring-red-600/10",
  Negative: "text-red-700 bg-red-50 ring-red-600/10",
};

export default function AccountCard({ account }: { account: Account }) {
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
            <time dateTime={"2023-01-23"}>{"January 23, 2023"}</time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">{"$2,000.32"}</div>
            <div
              className={classNames(
                statuses.Income,
                "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
              )}
            >
              Income
            </div>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">In Account</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-green-700">{`+ $2,000.32`}</div>
          </dd>
        </div>
      </dl>
    </>
  );
}

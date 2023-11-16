"use client";
import { usePathname } from "next/navigation";

import type { AccountsTable } from "@/server/db/schema";
import { classNames } from "@/app/_utils";

type AccountsProps = {
  accounts: Pick<AccountsTable, "name" | "publicId" | "initial">[];
};

export function Accounts({ accounts }: AccountsProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="text-xs font-semibold leading-6 text-gray-400">
        Your accounts
      </div>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {accounts.map((account) => (
          <li key={account.name}>
            <a
              href={`/account/${account.publicId}`}
              className={classNames(
                pathname === `/account/${account.publicId}`
                  ? "bg-gray-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
              )}
            >
              <span
                className={classNames(
                  pathname === `/account/${account.publicId}`
                    ? "border-indigo-600 text-indigo-600"
                    : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                  "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                )}
              >
                {account.initial}
              </span>
              <span className="truncate">{account.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

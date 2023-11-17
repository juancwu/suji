// Library imports
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Custom components
import AccountList from "@/app/_components/side-layout/account-list.client";
import Navigation from "@/app/_components/side-layout/navigation.client";

// Constants
import { appTitle } from "@/app/_components/side-layout/constants";

// Types
import type { Account } from "@/app/_components/side-layout/types";

export type DesktopSidebarProps = {
  accounts: Account[];
};

export default function DesktopSidebar({ accounts }: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200">
          <h1 className="text-xl">{appTitle}</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <Navigation />
            </li>
            <li>
              <AccountList accounts={accounts} />
            </li>
            <li className="mt-auto">
              <Link
                href="/settings"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                  aria-hidden="true"
                />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

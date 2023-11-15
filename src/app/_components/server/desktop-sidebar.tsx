import {
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { AccountsTable } from "@/server/db/schema";
import { Accounts } from "@/app/_components/client/side-layout/accounts";

export type Navigation = {
  name: string;
  href: string;
  icon: React.ReactNode;
  current: boolean;
};

export type UserNavigation = {
  name: string;
  href: string;
};

export type Account = Pick<AccountsTable, "publicId" | "name" | "initial">;

export type User = {
  imageUrl: string;
  username: string | null;
};

export type DesktopSidebarProps = {
  accounts: Account[];
};

const appTitle = "SUJI.";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function DesktopSidebar({ accounts }: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200">
          <h1 className="text-xl">{appTitle}</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        // item.current
                        //   ? "bg-gray-50 text-indigo-600"
                        //   : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                        "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                    >
                      <item.icon
                        className={classNames(
                          // item.current
                          //   ? "text-indigo-600"
                          //   : "text-gray-400 group-hover:text-indigo-600",
                          "text-gray-400 group-hover:text-indigo-600",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Accounts accounts={accounts} />
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

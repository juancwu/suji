"use client";

import {
  HomeIcon,
  CalendarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "@/app/_utils";

export const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={classNames(
              pathname === item.href
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
            )}
          >
            <item.icon
              className={classNames(
                pathname === item.href
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-indigo-600",
                "text-gray-400 group-hover:text-indigo-600",
                "h-6 w-6 shrink-0",
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

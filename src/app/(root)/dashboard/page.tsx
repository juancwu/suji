import SectionHeading from "@/app/_components/section-heading.server";
import AccountCard from "@/app/_components/account-card.server";
import Link from "next/link";
import { getButtonStyles } from "@/app/_styles/button.styles";
import type { Account, User } from "@/app/_components/side-layout/types";

export default function Dashboard({
  params,
}: {
  params: { accounts: Account[]; user: User };
}) {
  return (
    <section>
      <SectionHeading heading="Accounts" />
      <div className="py-5">
        <Link href="/new-account" className={getButtonStyles()}>
          Create Account
        </Link>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {params.accounts.map((account) => (
          <li
            key={account.publicId}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <AccountCard account={account} />
          </li>
        ))}
      </ul>
    </section>
  );
}

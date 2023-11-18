import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getButtonStyles } from "@/app/_styles/button.styles";
import Input from "@/app/_components/input.server";
import MoneyInput from "@/app/_components/money-input.server";

export default function Form() {
  const createAccount = async (formData: FormData) => {
    "use server";

    const accountName = formData.get("account-name");
    const initialAmount = formData.get("initial-amount");

    await Promise.resolve();

    console.log(accountName, initialAmount);

    revalidatePath("/dashboard");
  };

  return (
    <form action={createAccount} className="space-y-6">
      <Input
        label="Account Name"
        name="account-name"
        type="text"
        placeholder="Money"
        required
      />
      <MoneyInput
        label="Initial Amount"
        name="initial-amount"
        placeholder="0.00"
        unit="CAD"
        sign="$"
        inputMode="numeric"
      />
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className={getButtonStyles({
            className: "inline-flex w-full justify-center sm:col-start-2",
          })}
        >
          Create
        </button>
        <Link
          href="/dashboard"
          className={getButtonStyles({
            intent: "secondary",
            className:
              "mt-3 inline-flex w-full justify-center sm:col-start-1 sm:mt-0",
          })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

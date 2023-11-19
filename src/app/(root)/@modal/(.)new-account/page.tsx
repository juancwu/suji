"use client";

import { type FormEventHandler, useRef, type FormEvent } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getButtonStyles } from "@/app/_styles/button.styles";
import Input from "@/app/_components/input.server";
import MoneyInput from "@/app/_components/money-input.server";

export default function NewAccountModal() {
  const cancelButtonRef = useRef(null);
  const router = useRouter();

  const handleClose = () => router.back();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const post = async (evt: FormEvent<HTMLFormElement>) => {
      const formData = new FormData(evt.target as HTMLFormElement);
      console.log(formData);
      const res = await fetch("/api/account/create", {
        method: "POST",
        body: formData,
      });
      const body = await res.text();
      return body;
    };

    post(e).then(console.log).catch(console.error);
  };

  return (
    <Dialog
      as="div"
      open
      className="relative z-10"
      initialFocus={cancelButtonRef}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <PlusIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Create Account
                </Dialog.Title>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Account Name"
                name="name"
                type="text"
                placeholder="Money"
                required
              />
              <MoneyInput
                label="Initial Amount"
                name="amount"
                placeholder="0.00"
                unit="CAD"
                sign="$"
                inputMode="numeric"
              />
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className={getButtonStyles({
                    className:
                      "inline-flex w-full justify-center sm:col-start-2",
                  })}
                >
                  Create
                </button>
                <button
                  type="button"
                  className={getButtonStyles({
                    intent: "secondary",
                    className:
                      "mt-3 inline-flex w-full justify-center sm:col-start-1 sm:mt-0",
                  })}
                  onClick={handleClose}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

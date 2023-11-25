"use client";

import { Fragment, useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getButtonStyles } from "@/app/_styles/button.styles";
import Input from "@/app/_components/input.server";
import MoneyInput from "@/app/_components/money-input.server";
import LoadingSVG from "@/app/_components/loading-svg.server";
import { maxSummaryLen } from "@/server/db/schema";
import { showNotification } from "./notifications/notifications.utils";
import { useRouter } from "next/navigation";

export interface NewTransactionModalProps {
  accountPublidId: string;
}

export default function NewTransactionModal({
  accountPublidId,
}: NewTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("accountPublicId", accountPublidId);
      const res = await fetch("/api/transaction", {
        method: "POST",
        body: formData,
      });
      if (res.status >= 400) {
        showNotification({
          title: "Could not add transaction",
        });
      } else if (res.status === 201) {
        showNotification({
          title: "Transaction successfully added!",
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={getButtonStyles()}
        disabled={loading}
      >
        Add Transaction
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
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
                        Add New Transaction
                      </Dialog.Title>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <Input
                      label="Transaction Summary"
                      name="summary"
                      type="text"
                      maxLength={maxSummaryLen}
                      placeholder="Movie Tickets"
                      required
                      disabled={loading}
                    />
                    <MoneyInput
                      label="Transaction Amount"
                      name="amount"
                      placeholder="0.00"
                      unit="CAD"
                      sign="$"
                      inputMode="numeric"
                      required
                      disabled={loading}
                    />
                    <Input
                      label="Date"
                      name="date"
                      placeholder="YYYY-MM-DD"
                      pattern="\d{4}-\d{2}-\d{2}"
                      type="text"
                      title="Date in format YYYY-MM-DD"
                      required
                    />
                    <div>
                      <div className="flex justify-between">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Transaction Types
                        </label>
                        <span className="text-sm leading-6 text-gray-500">
                          Required
                        </span>
                      </div>
                      <fieldset className="mt-4">
                        <legend className="sr-only">Transaction type</legend>
                        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                          {["expense", "income", "transfer"].map(
                            (transactionType) => (
                              <div
                                key={transactionType}
                                className="flex items-center"
                              >
                                <input
                                  id={transactionType}
                                  name="type"
                                  type="radio"
                                  defaultChecked={transactionType === "expense"}
                                  value={transactionType}
                                  required
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                  htmlFor={transactionType}
                                  className="ml-3 block text-sm font-medium capitalize leading-6 text-gray-900"
                                >
                                  {transactionType}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </fieldset>
                    </div>
                    <Input
                      label="Transaction Details"
                      name="details"
                      type="text"
                      placeholder="Input any details for transaction"
                    />
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        className={getButtonStyles({
                          className:
                            "inline-flex w-full justify-center sm:col-start-2",
                        })}
                        disabled={loading}
                      >
                        {loading && <LoadingSVG />}
                        {loading ? "Adding..." : "Add"}
                      </button>
                      <button
                        type="button"
                        className={getButtonStyles({
                          intent: "secondary",
                          className:
                            "mt-3 inline-flex w-full justify-center sm:col-start-1 sm:mt-0",
                        })}
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

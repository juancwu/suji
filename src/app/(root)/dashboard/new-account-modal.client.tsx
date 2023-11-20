"use client";

import { Fragment, useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getButtonStyles } from "@/app/_styles/button.styles";
import Input from "@/app/_components/input.server";
import MoneyInput from "@/app/_components/money-input.server";
import LoadingSVG from "@/app/_components/loading-svg.server";

export default function NewAccountModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();

  // eslint-disable-next-line
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      const res = await fetch("/api/account/create", {
        method: "POST",
        body: formData,
      });
      await res.text();

      if (res.status !== 201) {
        return;
      }

      router.refresh();
      setOpen(false);
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
        Create Account
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
                      disabled={loading}
                    />
                    <MoneyInput
                      label="Initial Amount"
                      name="amount"
                      placeholder="0.00"
                      unit="CAD"
                      sign="$"
                      inputMode="numeric"
                      disabled={loading}
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
                        {loading ? "Creating..." : "Create"}
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

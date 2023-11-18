"use server";

import { revalidatePath } from "next/cache";

export async function createAccount(formdata: FormData) {
  revalidatePath("/dashboard");
}

import { z } from "zod";
import { auth } from "@clerk/nextjs";
import { maxAccountNameLen, publicIdLen } from "@/server/db/schema";
import { db } from "@/server/db";
import { accounts } from "@/server/db/schema";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const form = await req.formData();

  let name: string;
  let amount: number;
  // validate
  try {
    name = await z
      .string()
      .min(1)
      .max(maxAccountNameLen)
      .parseAsync(form.get("name"));
  } catch (error) {
    return new Response("bad name", { status: 400 });
  }
  try {
    amount = await z.coerce.number().parseAsync(form.get("amount"));
  } catch (error) {
    return new Response("bad amount", { status: 400 });
  }

  try {
    await db.insert(accounts).values({
      name,
      amount,
      publicId: nanoid(publicIdLen),
      userExternalId: userId,
      initial: name[0]!.toUpperCase(),
    });
    return new Response("new account created", { status: 201 });
  } catch (error) {
    return new Response("could not create new account", { status: 500 });
  }
}

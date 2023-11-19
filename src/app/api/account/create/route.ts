import { z } from "zod";
import { maxAccountNameLen } from "@/server/db/schema";

// TODO: validate/authorize request first

export async function POST(req: Request) {
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

  console.log(name, amount);

  return new Response("heyyy");
}

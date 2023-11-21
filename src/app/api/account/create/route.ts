import { z } from "zod";
import { auth } from "@clerk/nextjs";
import { maxAccountNameLen, publicIdLen } from "@/server/db/schema";
import { db } from "@/server/db";
import { accounts } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { StatusCodes } from "@/app/api/status-codes";
import { Errors } from "./create-account-errors";

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
    return Response.json(
      { error: Errors.InvalidAccountName },
      { status: StatusCodes.BadRequest },
    );
  }
  try {
    amount = await z.coerce.number().parseAsync(form.get("amount"));
  } catch (error) {
    return Response.json(
      { error: Errors.InvalidAccountAmount },
      { status: StatusCodes.BadRequest },
    );
  }

  try {
    await db.insert(accounts).values({
      name,
      amount,
      publicId: nanoid(publicIdLen),
      userExternalId: userId,
      initial: name[0]!.toUpperCase(),
    });
    return Response.json(
      { message: "new account created" },
      { status: StatusCodes.Created },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "DatabaseError") {
        if (error.message.includes("AlreadyExists")) {
          return Response.json(
            { error: Errors.AccountNameTaken },
            { status: StatusCodes.BadRequest },
          );
        }
        return Response.json(
          { error: Errors.DatabaseError },
          { status: StatusCodes.BadRequest },
        );
      }
    }
    return Response.json(
      { message: "could not create new account" },
      {
        status: StatusCodes.InternalServerError,
      },
    );
  }
}

import { z } from "zod";
import { auth } from "@clerk/nextjs";
import {
  type TransactionTypes,
  maxSummaryLen,
  publicIdLen,
  transactionTypes,
  transactions,
  accounts,
} from "@/server/db/schema";
import { db } from "@/server/db";
import { nanoid } from "nanoid";
import { StatusCodes } from "@/app/api/status-codes";
import { Errors } from "@/app/api/account/create/create-account-errors";
import { eq } from "drizzle-orm";
import { isValid } from "date-fns";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const form = await req.formData();

  let summary: string;
  let amount: number;
  let accountPublicId: string;
  let transactionType: TransactionTypes;
  let date: Date;

  // validate
  try {
    summary = await z
      .string()
      .min(1)
      .max(maxSummaryLen)
      .parseAsync(form.get("summary"));
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 5 },
      { status: StatusCodes.BadRequest },
    );
  }
  try {
    amount = await z.coerce.number().parseAsync(form.get("amount"));
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 6 },
      { status: StatusCodes.BadRequest },
    );
  }

  try {
    transactionType = await z
      .enum(transactionTypes)
      .parseAsync(form.get("type"));
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 8 },
      { status: StatusCodes.BadRequest },
    );
  }
  // correct the amount sign
  if (transactionType === "expense" && amount > -1) amount *= -1;
  else if (
    (transactionType === "income" || transactionType === "transfer") &&
    amount < 0
  )
    amount *= -1;

  try {
    accountPublicId = await z
      .string()
      .length(publicIdLen)
      .parseAsync(form.get("accountPublicId"));
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 7 },
      { status: StatusCodes.BadRequest },
    );
  }

  try {
    const dateString = form.get("date");
    if (!dateString) {
      return Response.json(
        // TODO: update error message
        { error: 9 },
        { status: StatusCodes.BadRequest },
      );
    }
    date = new Date(dateString as string);
    if (!isValid(date)) {
      return Response.json(
        // TODO: update error message
        { error: 9 },
        { status: StatusCodes.BadRequest },
      );
    }
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 9 },
      { status: StatusCodes.BadRequest },
    );
  }

  let details: string | undefined;
  try {
    details = await z.string().optional().parseAsync(form.get("details"));
  } catch (error) {
    return Response.json(
      // TODO: update error message
      { error: 10 },
      { status: StatusCodes.BadRequest },
    );
  }

  try {
    const account = await db.query.accounts.findFirst({
      where: (t, { eq }) => eq(t.publicId, accountPublicId),
      columns: {
        internalId: true,
        amount: true,
      },
    });
    if (!account) {
      return Response.json(
        { message: "No account found to add transaction" },
        { status: StatusCodes.BadRequest },
      );
    }

    await db.transaction(async (tx) => {
      await tx.insert(transactions).values({
        summary,
        amount,
        details,
        date,
        type: transactionType,
        publicId: nanoid(publicIdLen),
        userExternalId: userId,
        accountInternalId: account.internalId,
      });

      await tx
        .update(accounts)
        .set({ amount: account.amount + amount })
        .where(eq(accounts.internalId, account.internalId));
    });

    return Response.json(
      { message: "new transaction created" },
      { status: StatusCodes.Created },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "DatabaseError") {
        return Response.json(
          { message: Errors.DatabaseError },
          { status: StatusCodes.BadRequest },
        );
      }
    }
    return Response.json(
      { message: "could not create new transaction" },
      {
        status: StatusCodes.InternalServerError,
      },
    );
  }
}

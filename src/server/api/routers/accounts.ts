import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { accounts } from "@/server/db/schema";

export const accountRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        amount: z.coerce.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const publicId = nanoid(16);
      await ctx.db.insert(accounts).values({
        name: input.name,
        amount: input.amount,
        userExternalId: ctx.auth!.userId,
        initial: input.name[0]!.toUpperCase(),
        publicId,
      });
    }),
});

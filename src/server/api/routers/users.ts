import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../utils';
import { createUser } from '~/server/db/users.model';

export const usersRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(12),
            })
        )
        .output(z.boolean())
        .mutation(async ({ input }) => {
            try {
                await createUser(input);
                return true;
            } catch (error) {
                console.error(error);
            }
            return false;
        }),
    getUser: publicProcedure.query(({ ctx }) => {
        return {
            user: ctx.user !== undefined,
        };
    }),
});

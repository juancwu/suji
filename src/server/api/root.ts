import { createTRPCRouter } from '~/server/api/utils';
import { usersRouter } from './routers/users';

export const appRouter = createTRPCRouter({
    users: usersRouter,
});

export type AppRouter = typeof appRouter;

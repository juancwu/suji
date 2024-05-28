import { initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { verify } from 'jsonwebtoken';
import { User, getUserById } from '~/server/db/users.model';

interface JWT {
    id: string; // uuid
}

export const createContext = async (opts: CreateNextContextOptions) => {
    const token = opts.req.headers.authorization.split(' ')[1];
    let user: User | undefined = undefined;
    if (token) {
        const decoded = verify(token, process.env.JWT_SECRET as string) as JWT;
        user = await getUserById(decoded.id);
    }
    return { user };
};

type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

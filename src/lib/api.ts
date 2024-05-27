import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '~/server/api/root';

const getBaseURL = () => {
    if (typeof window !== 'undefined') return '';
    if (process.env.NODE_ENV === 'production')
        return 'https://suji.juancwu.dev';
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCProxyClient<AppRouter>({
    links: [
        loggerLink({
            enabled: () => process.env.NODE_ENV === 'development',
        }),
        httpBatchLink({ url: `${getBaseURL()}/api/trpc` }),
    ],
});

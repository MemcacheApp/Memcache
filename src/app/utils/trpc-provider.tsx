"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./trpc";

interface TrpcProviderProps {
    children: React.ReactNode;
}

export const TrpcProvider = ({ children }: TrpcProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { staleTime: 5000 } },
            }),
    );

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({
                    enabled: () => true,
                }),
                httpBatchLink({
                    url: "/api/trpc/",
                    fetch: async (input, init?) => {
                        const fetch = getFetch();
                        return fetch(input, {
                            ...init,
                            credentials: "include",
                        });
                    },
                }),
            ],
            transformer: superjson,
        }),
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools position="bottom-right" />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

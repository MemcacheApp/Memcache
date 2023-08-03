"use client";

import { trpc } from "@/src/app/utils/trpc";
import { useRouter } from "next/navigation";
import { LoadingMessage } from "./LoadingMessage";

interface LogInRequiredProps {
    children?: React.ReactNode;
}

export function LogInRequired(props: LogInRequiredProps) {
    const router = useRouter();

    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();

    if (isLoggedInQuery.isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <LoadingMessage message="Logging in..." />
            </div>
        );
    } else if (isLoggedInQuery.data) {
        return <>{props.children}</>;
    } else {
        router.push("/auth/login");
        return null;
    }
}

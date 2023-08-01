"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Link } from "./Link";
import { Loader } from "./Loader";
import { PageTitle } from "./typography";

interface LogInRequiredProps {
    children?: React.ReactNode;
}

export function LogInRequired(props: LogInRequiredProps) {
    const { data } = trpc.user.isLoggedIn.useQuery();

    if (data === undefined) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader varient="ellipsis" />
            </div>
        );
    } else if (data) {
        return <>{props.children}</>;
    } else {
        return (
            <>
                <PageTitle>Log in required</PageTitle>
                <Link href={"/auth/login"} className="mx-8">
                    Back to Login
                </Link>
            </>
        );
    }
}

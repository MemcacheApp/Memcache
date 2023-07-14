"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Loader } from "./Loader";

interface LogInRequiredProps {
    children?: React.ReactNode;
}

export function LogInRequired(props: LogInRequiredProps) {
    const { data } = trpc.user.isLoggedIn.useQuery();

    if (data === undefined) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loader varient="ellipsis" />
            </div>
        );
    } else if (data) {
        return <>{props.children}</>;
    } else {
        return <div>Log in required</div>;
    }
}

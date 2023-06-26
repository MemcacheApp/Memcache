"use client";

import { redirect } from "next/navigation";
import { trpc } from "@/src/app/utils/trpc";
import { Loader } from "@/ui/components/Loader";

export default function page() {
    const { data } = trpc.user.isLoggedIn.useQuery();

    if (data === undefined) {
        return <Loader />;
    } else if (data) {
        // if logged in, redirect to saves
        redirect("/app/saves");
    } else {
        // If not logged in, redirect to discover
        redirect("/app/discover");
    }
}

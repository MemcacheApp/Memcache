"use client";

import { redirect } from "next/navigation";
import { trpc } from "@/src/app/utils/trpc";

export default function page() {
    const { data } = trpc.user.isLoggedIn.useQuery();

    if (data === undefined) {
        return <div>Loading...</div>;
    } else if (data) {
        // if logged in, redirect to saves
        redirect("/saves");
    } else {
        // If not logged in, redirect to discover
        redirect("/discover");
    }
}

"use client";

import { Loader } from "@/ui/components";
import { redirect } from "next/navigation";
import { trpc } from "../../utils/trpc";

export default function ProfilePage() {
    const userInfoQuery = trpc.user.getUserInfo.useQuery();

    if (userInfoQuery.data) {
        redirect(`/app/profile/${userInfoQuery.data.id}`);
    }

    return (
        <div>
            <Loader varient="ellipsis" />
        </div>
    );
}

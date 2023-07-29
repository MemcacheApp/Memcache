"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    Loader,
    PageTitle,
    SuggestedCard,
    Topbar,
    TopbarTitle,
} from "@/ui/components";
import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface UserProfilePageProps {
    params: {
        id: string;
    };
}

export default function UserProfilePage(props: UserProfilePageProps) {
    const [isVisible, setIsVisible] = useState(true);

    const userInfoQuery = trpc.user.getUserInfo.useQuery();
    const userInfoByIdQuery = trpc.user.getUserInfoById.useQuery({
        userId: props.params.id,
    });

    const publicItemsQuery = trpc.item.getPublicItems.useQuery(
        {
            userId: props.params.id,
        },
        {
            enabled: isVisible,
        },
    );

    useEffect(() => {
        if (
            userInfoQuery.data?.id !== props.params.id &&
            userInfoByIdQuery.data &&
            !userInfoByIdQuery.data.publicProfile
        ) {
            setIsVisible(false);
        }
    }, [userInfoQuery.data, userInfoByIdQuery.data]);

    return (
        <div>
            <Topbar>
                {userInfoByIdQuery.data ? (
                    <TopbarTitle>
                        {userInfoByIdQuery.data.firstName}{" "}
                        {userInfoByIdQuery.data.lastName}
                        {"'s Profile"}
                    </TopbarTitle>
                ) : null}
            </Topbar>
            {userInfoByIdQuery.data ? (
                <PageTitle>
                    {userInfoByIdQuery.data.firstName}{" "}
                    {userInfoByIdQuery.data.lastName}
                    {"'s Profile"}
                    {userInfoByIdQuery.data.publicProfile ? null : (
                        <LockIcon className="inline-block ml-3" />
                    )}
                </PageTitle>
            ) : null}
            {isVisible ? (
                <div className="flex flex-col gap-3 mb-8 md:mx-8">
                    {publicItemsQuery.data ? (
                        publicItemsQuery.data.map((item) => (
                            <SuggestedCard key={item.url} data={item} />
                        ))
                    ) : (
                        <Loader varient="ellipsis" />
                    )}
                </div>
            ) : (
                <div className="mx-5 md:mx-8">
                    <p>This user&apos;s profile is private.</p>
                </div>
            )}
        </div>
    );
}

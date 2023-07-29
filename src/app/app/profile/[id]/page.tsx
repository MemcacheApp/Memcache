"use client";

import { trpc } from "@/src/app/utils/trpc";
import {
    Loader,
    PageTitle,
    SuggestedCard,
    Topbar,
    TopbarTitle,
} from "@/ui/components";

interface UserProfilePageProps {
    params: {
        id: string;
    };
}

export default function UserProfilePage(props: UserProfilePageProps) {
    const userInfoQuery = trpc.user.getUserInfoById.useQuery({
        userId: props.params.id,
    });

    const publicItemsQuery = trpc.item.getPublicItems.useQuery({
        userId: props.params.id,
    });

    return (
        <div>
            <Topbar>
                {userInfoQuery.data ? (
                    <TopbarTitle>
                        {userInfoQuery.data.firstName}{" "}
                        {userInfoQuery.data.lastName}
                        {"'s Profile"}
                    </TopbarTitle>
                ) : null}
            </Topbar>
            {userInfoQuery.data ? (
                <PageTitle>
                    {userInfoQuery.data.firstName} {userInfoQuery.data.lastName}
                    {"'s Profile"}
                </PageTitle>
            ) : null}
            <div className="flex flex-col gap-3 mb-8 md:mx-8">
                {publicItemsQuery.data ? (
                    publicItemsQuery.data.map((item) => (
                        <SuggestedCard key={item.url} data={item} />
                    ))
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </div>
        </div>
    );
}

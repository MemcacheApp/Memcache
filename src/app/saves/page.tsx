"use client";

import { LogInRequired, PageTitle, SaveInput } from "../../../ui/components";
import { trpc } from "../../app/utils/trpc";
import ItemCard from "../../../ui/components/ItemCard";

export default function SavesPage() {
    return (
        <div className="flex flex-col">
            <LogInRequired>
                <PageTitle>Saves</PageTitle>
                <SaveInput />
                <SaveList />
            </LogInRequired>
        </div>
    );
}

// Example save list
function SaveList() {
    const itemsQuery = trpc.item.getItems.useQuery();
    const items = itemsQuery.data;

    return (
        <div className="flex flex-col mt-3 gap-3">
            {items?.sort(
                (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf() // sort by createdAt
            )
                ? items.map((item) => <ItemCard data={item} key={item.id} />)
                : null}
        </div>
    );
}

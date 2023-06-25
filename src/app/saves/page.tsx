"use client";
import React, { useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    LogInRequired,
    PageTitle,
    SaveInput,
	StatusToggle,
} from "../components";

import { trpc } from "@/src/app/utils/trpc";

export default function SavesPage() {
    const [activeStatus, setActiveStatus] = React.useState(null);

    return (
        <div className="flex flex-col">
            <LogInRequired>
                <PageTitle>Saves</PageTitle>
                <SaveInput />
                <StatusToggle activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
                <SaveList activeStatus={activeStatus} />
            </LogInRequired>
        </div>
    );
}


// Example save list
function SaveList({ activeStatus }: { activeStatus: string | null }) {
    const itemsQuery = trpc.item.getItems.useQuery();
    const items = itemsQuery.data;

    const filterItems = items?.filter(item => {
        if (activeStatus === null) return true;
        if (activeStatus === 'Inbox' && item.status === 0) return true;
        if (activeStatus === 'Underway' && item.status === 1) return true;
        if (activeStatus === 'Completed' && item.status === 2) return true;
        if (activeStatus === 'Archive' && item.status === 3) return true;
        return false;
    });

    return (
        <div className="flex flex-col mt-3 gap-3">
            {filterItems
                ? filterItems.map((item) => (
                      <Card key={item.id}>
                          <CardHeader>
                              <CardTitle>{item.title}</CardTitle>
                              <CardDescription>{item.url}</CardDescription>
                              <CardContent>
                                  {item.description}
                                  <div>Collection: {item.collection.name}</div>
                                  <div className="flex gap-2">
                                      Tags:
                                      {item.tags.map((tag) => (
                                          <div key={tag.id}>{tag.name}</div>
                                      ))}
                                  </div>
                              </CardContent>
                          </CardHeader>
                      </Card>
                  ))
                : null}
        </div>
    );
}

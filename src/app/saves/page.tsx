"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    LogInRequired,
    PageTitle,
    SaveInput,
} from "../components";
import { trpc } from "@/src/app/utils/trpc";

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
            {items
                ? items.map((item) => (
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

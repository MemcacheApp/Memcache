"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { PanelRightClose } from "lucide-react";
import { Button } from "./Button";
import { CollectionSelector, TagSelector } from ".";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "../utils";
import { useItemListStore } from "@/src/app/store/item-list";
import { Separator } from "./Separator";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableRow,
} from "./Table";
import { StatusEnum, StatusNames } from "@/src/app/utils/Statuses";

interface ItemPanelProps {
    selectedItems: Set<string>;
    dismiss: () => void;
}

export function ItemPanel({ selectedItems, dismiss }: ItemPanelProps) {
    const ids = Array.from(selectedItems);

    return (
        <Card className="fixed flex flex-col right-5 w-80 p-4">
            <Button
                variant="ghost"
                className="m-3 w-10 !rounded-full p-0"
                onClick={dismiss}
            >
                <div className="h-4 w-4">
                    <PanelRightClose size={16} />
                </div>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            {ids.length > 1 ? (
                <div>Select {ids.length} items</div>
            ) : (
                <SingleItem id={ids[0]} />
            )}
        </Card>
    );
}

function SingleItem({ id }: { id: string }) {
    const queryClient = useQueryClient();

    const itemQuery = trpc.item.getItem.useQuery({ itemId: id });
    const data = itemQuery.data;

    const collectionsQuery = trpc.collection.getCollections.useQuery();
    const tagsQuery = trpc.tag.getTags.useQuery();

    const setCollectionOnItem = trpc.item.setCollection.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: [["collection", "getCollections"], { type: "query" }],
                exact: true,
            });
            console.log("set collection on item?");
        },
    });

    const addTagToItemMutation = trpc.item.addTag.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: [["tag", "getTags"], { type: "query" }],
                exact: true,
            });
            console.log("added tag to item?");
        },
    });

    const removeTagFromItemMutation = trpc.item.removeTag.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("removed tag from item?");
        },
    });

    return (
        <div>
            {data ? (
                <div>
                    <div className="text-xl font-bold">
                        <ExternalLink href={data.url}>
                            {data.title}
                        </ExternalLink>
                    </div>
                    <div className="mt-1 text-slate-450 ">{data.siteName}</div>
                    <div className="mt-3">{data.description}</div>
                    <Separator className="my-4" />
                    <div>Status</div>
                    <div>{StatusNames[data.status as StatusEnum]}</div>
                    <Separator className="my-4" />
                    <div className="text-slate-450 text-sm tracking-wide uppercase">
                        Metadata
                    </div>
                    <Table className="mt-2">
                        <TableBody>
                            <TableRow divider={false} interactive={false}>
                                <TableCell className="text-slate-450">
                                    Type
                                </TableCell>
                                <TableCell className="capitalize">
                                    {data.type}
                                </TableCell>
                            </TableRow>
                            <TableRow divider={false} interactive={false}>
                                <TableCell className="text-slate-450">
                                    URL
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {data.url}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div>{data.thumbnail}</div>
                    <div>{`${data.createdAt.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}`}</div>
                    {data.releaseTime ? (
                        <div>{`${data.releaseTime.toLocaleDateString(
                            undefined,
                            {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}`}</div>
                    ) : null}
                    {data.duration ? <div>{data.duration}</div> : null}
                    {data.author ? <div>{data.author}</div> : null}
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        value={data.collection.name}
                        setValue={(newCollection) => {
                            setCollectionOnItem.mutate({
                                itemId: data.id,
                                collectionName: newCollection,
                            });
                        }}
                        size={"xs"}
                    />
                    <div>
                        {data.tags.map((tag, index) => (
                            <TagSelector
                                key={tag.id}
                                index={index}
                                tags={tagsQuery.data}
                                value={tag.name}
                                setValue={(newTag) =>
                                    addTagToItemMutation.mutate({
                                        itemId: data.id,
                                        tagName: newTag,
                                    })
                                }
                                remove={(index) => {
                                    removeTagFromItemMutation.mutate({
                                        itemId: data.id,
                                        tagId: data.tags[index].id,
                                    });
                                }}
                            />
                        ))}
                        <TagSelector
                            tags={tagsQuery.data}
                            value=""
                            index={-1}
                            setValue={(newTag) => {
                                addTagToItemMutation.mutate({
                                    itemId: data.id,
                                    tagName: newTag,
                                });
                            }}
                            remove={(index) => {
                                removeTagFromItemMutation.mutate({
                                    itemId: data.id,
                                    tagId: data.tags[index].id,
                                });
                            }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function ExternalLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

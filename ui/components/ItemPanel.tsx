"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Card } from "./Card";
import { X } from "lucide-react";
import { Button } from "./Button";
import { CollectionSelector, TagSelector } from ".";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "../utils";
import { useItemListStore } from "@/src/app/store/item-list";
import { Separator } from "./Separator";
import { Table, TableBody, TableCell, TableRow } from "./Table";
import { StatusEnum, StatusNames } from "@/src/app/utils/Statuses";

export function ItemPanel() {
    const { selectedItems, isShowPanel, dismissPanel } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            isShowPanel: state.isShowPanel,
            dismissPanel: state.dismissPanel,
        })
    );

    const ids = Array.from(selectedItems);

    const [isCollapse, setIsCollapse] = useState(true);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        if (isShowPanel) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
            }, 10);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [isShowPanel]);

    return (
        <div>
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 right-0 bg-black/40 md:hidden transition-opacity",
                    isCollapse ? "opacity-0" : "opacity-100",
                    {
                        hidden: isHidden,
                    }
                )}
            ></div>
            <Card
                className={cn(
                    "fixed flex flex-col right-5 w-80 p-4 top-3 max-md:w-auto max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:top-14 transition-transform",
                    {
                        hidden: isHidden,
                        "md:translate-x-[20rem]": isCollapse,
                        "max-md:translate-y-[100%]": isCollapse,
                    }
                )}
            >
                <div className="flex">
                    <Button
                        variant="ghost"
                        className="w-10 rounded-full p-0"
                        onClick={dismissPanel}
                    >
                        <div className="h-4 w-4">
                            <X size={16} />
                        </div>
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                </div>

                {ids.length > 1 ? (
                    <div>Select {ids.length} items</div>
                ) : (
                    <SingleItem id={ids[0]} />
                )}
            </Card>
        </div>
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

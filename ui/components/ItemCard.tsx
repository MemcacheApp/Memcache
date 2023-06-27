"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuIconItem,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    Card,
    CardTitle,
    CardFooter,
    Button,
} from ".";
import { trpc } from "../../src/app/utils/trpc";
import { Item, Collection, Tag } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import {
    Package2,
    ExternalLink,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Inbox,
    CheckCircle2,
    CircleDot,
    Archive,
    Globe,
} from "lucide-react";
import Link from "next/link";

interface ItemCardProps {
    data: Item & { collection: Collection; tags: Tag[] };
    onSelect: (id: string) => void;
}

export function ItemCard({ data, onSelect }: ItemCardProps) {
    const queryClient = useQueryClient();

    const deleteItemMutation = trpc.item.deleteItem.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("deleted item?");
        },
    });

    const handleDeleteItem = async () => {
        try {
            await deleteItemMutation.mutateAsync({ id: data.id });
        } catch (error) {
            console.error(error);
        }
    };

    const updateItemStatusMutation = trpc.item.updateItemStatus.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            });
            console.log("updated item status");
        },
    });

    const handleUpdateItemStatus = async (status: number) => {
        try {
            await updateItemStatusMutation.mutateAsync({
                itemId: data.id,
                status,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card
            className="flex flex-col cursor-pointer hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            tabIndex={0}
            key={data.id}
            onClick={() => {
                onSelect(data.id);
            }}
        >
            <div className="flex">
                <div className="flex flex-col flex-grow p-6">
                    <CardTitle>{data.title}</CardTitle>
                    <p className="mt-3">{data.description}</p>
                </div>
                {data.thumbnail ? (
                    <img
                        className="max-h-28 lg:max-h-40 m-6 rounded-lg"
                        src={data.thumbnail}
                    />
                ) : null}
            </div>
            <CardFooter className="flex justify-between">
                <div className="flex gap-5 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                        <Globe size={16} />
                        {data.siteName}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Package2 size={16} />
                        <Link
                            className="hover:underline"
                            href={`/app/collection/${data.collection.id}`}
                        >
                            {data.collection.name}
                        </Link>
                    </span>
                    <div>
                        {data.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/app/tag/${tag.id}`}
                                tabIndex={-1}
                            >
                                <Button
                                    className="px-4"
                                    variant="secondary"
                                    size="xs"
                                >
                                    {tag.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant={"icon"} size={"none"}>
                                <MoreHorizontal size={18} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuIconItem Icon={ExternalLink}>
                                    Visit Link
                                </DropdownMenuIconItem>
                                <DropdownMenuIconItem Icon={PanelRightOpen}>
                                    Open Item
                                </DropdownMenuIconItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Summaries
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                View Summaries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Generate Summary
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Flashcards
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                View Flashcards
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Generate Flashcards
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuIconItem
                                Icon={Trash2}
                                className="text-red-600"
                                onClick={handleDeleteItem}
                            >
                                Delete
                            </DropdownMenuIconItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={() => handleUpdateItemStatus(0)}
                    >
                        <Inbox size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={() => handleUpdateItemStatus(1)}
                    >
                        <CircleDot size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={() => handleUpdateItemStatus(2)}
                    >
                        <CheckCircle2 size={18} />
                    </Button>
                    <Button
                        variant={"icon"}
                        size={"none"}
                        onClick={() => handleUpdateItemStatus(3)}
                    >
                        <Archive size={18} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

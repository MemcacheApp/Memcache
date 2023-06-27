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
} from "./DropdownMenu";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./Card";
import { CollectionSelector } from "./CollectionSelector";
import { TagSelector } from "./TagSelector";
import { trpc } from "../../src/app/utils/trpc";
import { Item, Collection, Tag } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import {
    Package2,
    Tag as LuTag,
    ExternalLink,
    Trash2,
    MoreHorizontal,
    PanelRightOpen,
    Inbox,
    CheckCircle2,
    CircleDot,
    Archive,
} from "lucide-react";

export default function ItemCard({
    data,
}: {
    data: Item & { collection: Collection; tags: Tag[] };
}) {
    const queryClient = useQueryClient();

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
                userId: data.userId,
                itemId: data.id,
                status,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card key={data.id}>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.url}</CardDescription>
                <CardContent className="relative">
                    {data.description}
                    <div>Collection: {data.collection.name}</div>
                    <div className="flex gap-2">
                        Tags:
                        {data.tags.map((tag) => (
                            <div key={tag.id}>{tag.name}</div>
                        ))}
                    </div>
                    {/* <DeleteContent item={data} /> */}
                    <div className="w-fit absolute right-6 bottom-4 flex justify-end gap-3">
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
                </CardContent>
            </CardHeader>
            <CardFooter>
                <div className="flex gap-2 flex-wrap items-center w-full pt-2 border-t-2 border-solid">
                    <div className="mx-2">
                        <Package2 />
                    </div>
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
                    <div className="ml-4 mr-2 border-l-2 border-solid content-[''] h-6"></div>
                    <div className="mx-2">
                        <LuTag />
                    </div>
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
            </CardFooter>
        </Card>
    );
}

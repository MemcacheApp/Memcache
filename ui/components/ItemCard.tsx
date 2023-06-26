import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuIconItem,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
import { DeleteContent } from "./DeleteContent";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import { Package2, Tag as LuTag, ExternalLink, Trash2 } from "lucide-react";

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

    return (
        <Card key={data.id}>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.url}</CardDescription>
                <CardContent>
                    {data.description}
                    <div>Collection: {data.collection.name}</div>
                    <div className="flex gap-2">
                        Tags:
                        {data.tags.map((tag) => (
                            <div key={tag.id}>{tag.name}</div>
                        ))}
                    </div>
                </CardContent>
                <DeleteContent item={data} />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button>More Operations</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuIconItem Icon={ExternalLink}>
                            Open Link
                        </DropdownMenuIconItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
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

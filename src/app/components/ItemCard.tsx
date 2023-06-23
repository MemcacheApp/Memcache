import { LuPackage2, LuTag } from "react-icons/lu";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./Card";
import { CollectionSelector } from "./CollectionSelector";
import { TagSelector } from "./TagSelector";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { removeTag, setTag } from "../utils";
import { Item, Collection, Tag } from "@prisma/client";

export default function ItemCard({
    data,
}: {
    data: Item & { collection: Collection; tags: Tag[] };
}) {
    const collectionsQuery = trpc.collection.getCollections.useQuery();
    const tagsQuery = trpc.tag.getTags.useQuery();

    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);

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
                <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center rounded-md border-solid border-2">
                        <div className="mx-3">
                            <LuPackage2 />
                        </div>
                        <CollectionSelector
                            collections={collectionsQuery.data}
                            value={collection}
                            setValue={setCollection}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="mx-2">
                            <LuTag />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {tags.map((tag, index) => (
                                <TagSelector
                                    key={tag}
                                    index={index}
                                    tags={tagsQuery.data}
                                    value={tag}
                                    setValue={(newTag, index) =>
                                        setTags(setTag(tags, newTag, index))
                                    }
                                    remove={(index) =>
                                        setTags(removeTag(tags, index))
                                    }
                                />
                            ))}
                            <TagSelector
                                tags={tagsQuery.data}
                                value=""
                                index={-1}
                                setValue={(newTag, index) =>
                                    setTags(setTag(tags, newTag, index))
                                }
                                remove={(index) =>
                                    setTags(removeTag(tags, index))
                                }
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

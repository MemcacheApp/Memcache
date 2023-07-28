import { usePerferences } from "@/src/app/utils/procedures";
import { trpc } from "@/src/app/utils/trpc";
import { SuggestedItem } from "@/src/datatypes/item";
import {
    CheckIcon,
    ExternalLinkIcon,
    Package2,
    PlusIcon,
    TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    AddTag,
    Button,
    CollectionSelector,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Label,
    SimpleItemCard,
    SimpleTag,
    Switch,
} from ".";

interface SuggestedCardProps {
    data: SuggestedItem;
}

export function SuggestedCard({ data }: SuggestedCardProps) {
    const [isOpenCreateItem, setIsOpenCreateItem] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    return (
        <>
            <SimpleItemCard
                type={data.type}
                title={data.title}
                description={data.description}
                thumbnail={data.thumbnail}
                url={data.url}
                siteName={data.siteName}
                format={{
                    growHeight: true,
                }}
                footerRight={
                    <>
                        <Link href={data.url} tabIndex={-1}>
                            <Button variant="icon" size="none">
                                <ExternalLinkIcon size={18} />
                            </Button>
                        </Link>

                        {isAdded ? (
                            <Button variant="icon" size="none">
                                <CheckIcon
                                    className="text-green-600"
                                    size={18}
                                />
                            </Button>
                        ) : (
                            <Button
                                variant="icon"
                                size="none"
                                onClick={() => {
                                    setIsOpenCreateItem(true);
                                }}
                            >
                                <PlusIcon size={18} />
                            </Button>
                        )}
                    </>
                }
            />
            <CreateItemDialog
                open={isOpenCreateItem}
                onOpenChange={setIsOpenCreateItem}
                setIsAdded={setIsAdded}
                data={data}
            />
        </>
    );
}

interface CreateItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: SuggestedItem;
    setIsAdded: (isAdded: boolean) => void;
}

function CreateItemDialog({
    open,
    onOpenChange,
    setIsAdded,
    data,
}: CreateItemDialogProps) {
    const ctx = trpc.useContext();
    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => {
            ctx.item.getUserItems.invalidate();
            onOpenChange(false);
            setIsAdded(true);
        },
    });
    const perferences = usePerferences();

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        if (perferences) {
            setIsPublic(perferences.publicNewItem);
        }
    }, [perferences]);

    const addTag = (name: string) => {
        if (!tags.includes(name)) {
            setTags([...tags, name]);
        }
    };

    const removeTag = (name: string) => {
        setTags(tags.filter((tagName) => tagName != name));
    };

    const handleSubmit = () => {
        createItemMutation.mutate({
            url: data.url,
            collectionName: collection,
            tagNames: tags,
            public: isPublic,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Item</DialogTitle>
                </DialogHeader>
                <SimpleItemCard
                    type={data.type}
                    title={data.title}
                    description={data.description}
                    thumbnail={data.thumbnail}
                    url={data.url}
                    siteName={data.siteName}
                    className="max-h-64"
                    format={{
                        forceList: true,
                    }}
                    footerLeft={
                        <div className="flex items-center gap-3 ml-auto">
                            <Label htmlFor="airplane-mode">Public</Label>
                            <Switch
                                id="is-public"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>
                    }
                />
                <div className="flex gap-3 flex-wrap items-center">
                    <Package2 className="text-slate-500" size={18} />
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        value={collection}
                        onSelect={setCollection}
                        disabled={createItemMutation.isLoading}
                    />
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    <TagIcon className="text-slate-500" size={18} />
                    {tags.map((tag) => (
                        <SimpleTag
                            key={tag}
                            value={tag}
                            remove={removeTag}
                            disabled={createItemMutation.isLoading}
                            editMode
                        />
                    ))}
                    <AddTag
                        tags={tagsQuery.data}
                        onSelect={addTag}
                        disabled={createItemMutation.isLoading}
                        selectedTags={tags}
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={createItemMutation.isLoading}
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

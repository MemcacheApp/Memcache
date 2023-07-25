import { useItemListStore } from "@/src/app/store/item-list";
import { trpc } from "@/src/app/utils/trpc";
import { ItemStatus } from "@prisma/client";
import {
    Filter,
    PanelRightOpenIcon,
    SquareStack,
    Trash2,
    X,
} from "lucide-react";
import {
    AddTag,
    Button,
    Card,
    CollectionSelector,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    SimpleTag,
    Tabs,
    TabsList,
    TabsTrigger,
} from ".";
import { cn } from "../utils";
import { StatusIcon } from "./StatusIcon";

export function ItemListOptions() {
    const isMultiselect = useItemListStore((state) => state.isMultiselect);

    return (
        <div className="flex items-center gap-3 max-md:mx-5 mx-8 mb-3 h-11">
            {isMultiselect ? <MultiselectOptions /> : <NormalOptions />}
        </div>
    );
}

function NormalOptions() {
    const enableMultiselect = useItemListStore(
        (state) => state.enableMultiselect,
    );

    return (
        <>
            <StatusToggle />
            <TagFilterSelector />
            <Button
                variant="shadow"
                size="sm"
                className="w-10 p-0 rounded-full shrink-0"
                onClick={enableMultiselect}
            >
                <div className="flex items-center justify-center w-4 h-4">
                    <SquareStack />
                </div>
                <span className="sr-only">Multiselect</span>
            </Button>
        </>
    );
}

function MultiselectOptions() {
    const { selectedItems, showPanel, disableMultiselect } = useItemListStore(
        (state) => ({
            selectedItems: state.selectedItems,
            showPanel: state.showPanel,
            disableMultiselect: state.disableMultiselect,
        }),
    );

    const ctx = trpc.useContext();

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();

    const setCollectionOnItem = trpc.item.setItemCollection.useMutation({
        onSuccess: () => {
            ctx.item.getItem.invalidate();
            ctx.item.getUserItems.invalidate();
            ctx.collection.getUserCollections.invalidate();
        },
    });

    const deleteItemMutation = trpc.item.deleteItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleDeleteItems = async () => {
        selectedItems.forEach(async (id) => {
            try {
                await deleteItemMutation.mutateAsync({ id });
            } catch (error) {
                console.error(error);
            }
        });
        selectedItems.clear();
    };

    const updateItemStatusMutation = trpc.item.setItemStatus.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const handleUpdateItemsStatus = async (status: ItemStatus) => {
        selectedItems.forEach(async (itemId) => {
            try {
                await updateItemStatusMutation.mutateAsync({
                    itemId,
                    status,
                });
            } catch (error) {
                console.error(error);
            }
        });
        selectedItems.clear();
    };

    const statusNames = Object.values(ItemStatus);

    return (
        <>
            <div className="flex items-center gap-5 overflow-x-auto h-full whitespace-nowrap grow">
                <div className="flex items-center">
                    <SquareStack size={18} className="mr-2" />
                    <span className="font-medium">
                        Selected {selectedItems.size}
                        {selectedItems.size === 1 ? " item" : " items"}
                    </span>
                </div>
                <div
                    className={cn("flex items-center gap-3", {
                        hidden: selectedItems.size === 0,
                    })}
                >
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        onSelect={(collectionName) => {
                            selectedItems.forEach((itemId) => {
                                setCollectionOnItem.mutate({
                                    itemId,
                                    collectionName,
                                });
                            });
                        }}
                        trigger={
                            <Button variant="shadow" size="sm">
                                Move to
                            </Button>
                        }
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="shadow" size="sm">
                                Set Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {statusNames.map((value) => (
                                <DropdownMenuItem
                                    key={value}
                                    onClick={() => {
                                        handleUpdateItemsStatus(value);
                                    }}
                                >
                                    <div className="mr-2">
                                        <StatusIcon status={value} size={18} />
                                    </div>
                                    {value}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="shadow"
                        size="sm"
                        className="text-red-600"
                        onClick={handleDeleteItems}
                    >
                        <Trash2 className="mr-2" size={18} />
                        Delete
                    </Button>
                </div>
            </div>
            <Button variant="shadow" size="sm" onClick={showPanel}>
                <PanelRightOpenIcon className="mr-2" size={18} />
                More
            </Button>
            <Button
                variant="shadow"
                size="sm"
                className="w-10 p-0 rounded-full shrink-0"
                onClick={disableMultiselect}
            >
                <div className="flex items-center justify-center w-4 h-4">
                    <X />
                </div>
                <span className="sr-only">Exit Multiselect</span>
            </Button>
        </>
    );
}

function StatusToggle() {
    const { activeStatus, setActiveStatus } = useItemListStore((state) => ({
        activeStatus: state.activeStatus,
        setActiveStatus: state.setActiveStatus,
    }));

    return (
        <Tabs
            className="grow overflow-x-auto"
            value={activeStatus}
            onValueChange={(status) => setActiveStatus(status as ItemStatus)}
        >
            <TabsList>
                {Object.values(ItemStatus).map((value) => {
                    return (
                        <TabsTrigger
                            className="data-[state=active]:border px-3 py-2 rounded-md"
                            key={value}
                            value={value}
                        >
                            <StatusIcon
                                className="mr-2"
                                size={18}
                                status={value}
                            />
                            {value}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}

function TagFilterSelector() {
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const { includedTags, excludedTags, setIncludedTags, setExcludedTags } =
        useItemListStore((state) => ({
            includedTags: state.includedTags,
            excludedTags: state.excludedTags,
            setIncludedTags: state.setIncludedTags,
            setExcludedTags: state.setExcludedTags,
        }));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="shadow" size="sm">
                    <Filter className="mr-2" size={18} />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1 w-[250px]">
                <Card className="p-1">
                    <div className="font-medium">Include:</div>
                    <div className="flex flex-wrap gap-3">
                        {Array.from(includedTags).map((tag, index) => (
                            <SimpleTag
                                key={index}
                                value={tag}
                                remove={() => {
                                    includedTags.delete(tag);
                                    setIncludedTags(new Set(includedTags));
                                }}
                                editMode
                            />
                        ))}
                        <AddTag
                            tags={tagsQuery.data}
                            onSelect={(tag) => {
                                includedTags.add(tag);
                                setIncludedTags(new Set(includedTags));
                            }}
                            selectedTags={Array.from(includedTags)}
                            disableCreation
                        />
                    </div>
                </Card>
                <Card className="p-1">
                    <div className="text-red-600 font-medium">Exclude:</div>
                    <div className="flex flex-wrap gap-3">
                        {Array.from(excludedTags).map((tag, index) => (
                            <SimpleTag
                                key={index}
                                value={tag}
                                remove={() => {
                                    excludedTags.delete(tag);
                                    setExcludedTags(new Set(excludedTags));
                                }}
                                editMode
                            />
                        ))}
                        <AddTag
                            tags={tagsQuery.data}
                            onSelect={(tag) => {
                                excludedTags.add(tag);
                                setExcludedTags(new Set(excludedTags));
                            }}
                            selectedTags={Array.from(excludedTags)}
                            disableCreation
                        />
                    </div>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

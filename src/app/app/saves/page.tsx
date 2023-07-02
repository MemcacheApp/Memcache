"use client";

import { useState } from "react";

import {
    LogInRequired,
    PageTitle,
    SaveInput,
    StatusToggle,
    ItemPanel,
    Button,
    WithPanel,
    SaveList,
} from "@/ui/components";
import { StatusEnum } from "../../utils/Statuses";
import { SquareStack, X } from "lucide-react";

export default function SavesPage() {
    const [activeStatus, setActiveStatus] = useState<StatusEnum>(
        StatusEnum.Inbox
    );

    const [isShowPanel, setIsShowPanel] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [isMultiselect, setIsMultiselect] = useState(false);

    const selectItem = (id: string) => {
        if (isMultiselect) {
            setSelectedItems((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                return next;
            });
        } else {
            setSelectedItems(new Set([id]));
            setIsShowPanel(true);
        }
    };

    const exitMultiselect = () => {
        setIsShowPanel(false);
        setSelectedItems(new Set());
        setIsMultiselect(false);
    };

    return (
        <div className="flex flex-col">
            <LogInRequired>
                <WithPanel isShowPanel={isShowPanel}>
                    <PageTitle>Saves</PageTitle>
                    <div className="px-8 max-md:px-5">
                        <SaveInput />
                        <div className="max-w-full flex justify-between items-center mt-5 gap-5">
                            {isMultiselect ? (
                                <>
                                    <div className="flex items-center gap-5 whitespace-nowrap overflow-auto">
                                        <div className="flex items-center">
                                            <SquareStack
                                                size={18}
                                                className="mr-2"
                                            />
                                            <span className="font-medium">
                                                Selected {selectedItems.size}
                                                {selectedItems.size === 1
                                                    ? " item"
                                                    : " items"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button variant="outline">
                                                Move to
                                            </Button>
                                            <Button variant="outline">
                                                Mark as
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setIsShowPanel(true)
                                                }
                                            >
                                                More
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-10 rounded-full p-0 shrink-0"
                                        onClick={exitMultiselect}
                                    >
                                        <div className="flex items-center justify-center h-4 w-4">
                                            <X />
                                        </div>
                                        <span className="sr-only">
                                            Exit Multiselect
                                        </span>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <StatusToggle
                                        activeStatus={activeStatus}
                                        setActiveStatus={setActiveStatus}
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-10 rounded-full p-0 shrink-0"
                                        onClick={() => setIsMultiselect(true)}
                                    >
                                        <div className="flex items-center justify-center h-4 w-4">
                                            <SquareStack />
                                        </div>
                                        <span className="sr-only">
                                            Multiselect
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <SaveList
                        activeStatus={activeStatus}
                        selectedItems={selectedItems}
                        selectItem={selectItem}
                    />
                </WithPanel>
                <ItemPanel
                    selectedItems={selectedItems}
                    isShow={isShowPanel}
                    dismiss={() => setIsShowPanel(false)}
                />
            </LogInRequired>
        </div>
    );
}

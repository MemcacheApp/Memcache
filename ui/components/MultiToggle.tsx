import { ItemStatus } from "@prisma/client";
import React, { useEffect } from "react";
import { cn } from "../utils";
import { StatusIcon } from "./StatusIcon";

// Tried using these constants to calculate dimensions for styling, but tailwind
// didn't like it. Keep here for reference.
// const RADIUS = 1; // rem
// const GAP = 0.2; // rem
// const PADDING = 0.4; // rem
// const containerWidth =
//     Object.values(StatusEnum).length * (2 * RADIUS + GAP) - GAP;

export default function MultiToggle({
    currentStatus,
    setStatus,
}: {
    currentStatus: ItemStatus;
    setStatus: (status: ItemStatus) => void;
}) {
    console.log(`rendering multitoggle with status ${currentStatus}`);
    const [selectedPosition, setSelectedPosition] =
        React.useState<ItemStatus>(currentStatus);
    const [spotlightPosition, setSpotlightPosition] =
        React.useState<ItemStatus>(currentStatus);

    useEffect(() => {
        setSelectedPosition(currentStatus);
        setSpotlightPosition(currentStatus);
    }, [currentStatus]);

    return (
        <div
            className={cn(
                "bg-muted rounded-[1rem] flex justify-between items-center relative w-[8.6rem]",
            )}
        >
            <div
                className={cn(
                    "w-[2rem] h-[2rem] rounded-full bg-slate-300 absolute transition-left",
                    {
                        "left-0": spotlightPosition === ItemStatus.Inbox,
                        "left-[2.2rem]":
                            spotlightPosition === ItemStatus.Underway,
                        "left-[4.4rem]":
                            spotlightPosition === ItemStatus.Complete,
                        "left-[6.6rem]":
                            spotlightPosition === ItemStatus.Archive,
                    },
                )}
            />
            {Object.values(ItemStatus).map((value) => (
                <div
                    key={value}
                    className={cn(
                        "rounded-full w-[2rem] h-[2rem] p-[0.4rem] flex justify-center items-center relative text-slate-450 transition-colors hover:cursor-pointer hover:text-black",
                        {
                            "text-black": value === selectedPosition,
                        },
                    )}
                    onMouseEnter={() => {
                        if (typeof value !== "number") return;
                        setSpotlightPosition(value);
                    }}
                    onMouseLeave={() => {
                        setSpotlightPosition(selectedPosition);
                    }}
                    onClick={(e) => {
                        // e.stopPropagation();
                        setStatus(value);
                    }}
                >
                    <StatusIcon status={value} size={18} />
                </div>
            ))}
        </div>
    );
}

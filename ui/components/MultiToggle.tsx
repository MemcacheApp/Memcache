import React, { useEffect } from "react";
import { cn } from "../utils";
import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import renderIcon from "@/src/app/utils/renderIcon";

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
    currentStatus: StatusEnum;
    setStatus: (status: StatusEnum) => void;
}) {
    console.log(`rendering multitoggle with status ${currentStatus}`);
    const [selectedPosition, setSelectedPosition] =
        React.useState<StatusEnum>(currentStatus);
    const [spotlightPosition, setSpotlightPosition] =
        React.useState<StatusEnum>(currentStatus);

    useEffect(() => {
        setSelectedPosition(currentStatus);
        setSpotlightPosition(currentStatus);
    }, [currentStatus]);

    return (
        <div
            className={cn(
                "bg-muted rounded-[1rem] flex justify-between items-center relative w-[8.6rem]"
            )}
        >
            <div
                className={cn(
                    "w-[2rem] h-[2rem] rounded-full bg-slate-300 absolute transition-left",
                    {
                        "left-0": spotlightPosition === StatusEnum.Inbox,
                        "left-[2.2rem]":
                            spotlightPosition === StatusEnum.Underway,
                        "left-[4.4rem]":
                            spotlightPosition === StatusEnum.Complete,
                        "left-[6.6rem]":
                            spotlightPosition === StatusEnum.Archive,
                    }
                )}
            />
            {Object.values(StatusEnum)
                .filter((value) => typeof value === "number")
                .map((value) => (
                    <div
                        key={value}
                        className={cn(
                            "rounded-full w-[2rem] h-[2rem] p-[0.4rem] flex justify-center items-center relative text-slate-450 transition-colors hover:cursor-pointer hover:text-black",
                            {
                                "text-black": value === selectedPosition,
                            }
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
                            if (typeof value !== "number") return;
                            setStatus(value);
                        }}
                    >
                        {renderIcon(StatusIcons[value])}
                    </div>
                ))}
        </div>
    );
}

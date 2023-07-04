import React, { useEffect } from "react";
import { cn } from "../utils";
import { StatusEnum, StatusIcons } from "@/src/app/utils/Statuses";
import renderIcon from "@/src/app/utils/renderIcon";

const RADIUS = 1; // rem
const GAP = 0.2; // rem]
const PADDING = 0.4; // rem

export default function MultiToggle({
    currentStatus,
    setStatus,
}: {
    currentStatus: StatusEnum;
    setStatus: (status: StatusEnum) => void;
}) {
    console.log(`render multitoggle with status ${currentStatus}`);
    const [selectedPosition, setSelectedPosition] =
        React.useState<StatusEnum>(currentStatus);
    const [spotlightPosition, setSpotlightPosition] =
        React.useState<StatusEnum>(currentStatus);

    useEffect(() => {
        setSelectedPosition(currentStatus);
        setSpotlightPosition(currentStatus);
    }, [currentStatus]);

    const containerWidth =
        Object.values(StatusEnum).length * (2 * RADIUS + GAP) - GAP;
    console.log(`containerWidth: ${containerWidth}`);

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
                            e.stopPropagation();
                            if (typeof value !== "number") return;
                            setSelectedPosition(value);
                            setSpotlightPosition(value);
                            setStatus(value);
                        }}
                    >
                        {renderIcon(StatusIcons[value])}
                    </div>
                ))}
        </div>
    );
}

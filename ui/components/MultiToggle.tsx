"use client";

import { ItemStatus } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from ".";
import { StatusIcon } from "./StatusIcon";

// Tried using these constants to calculate dimensions for styling, but tailwind
// didn't like it. Keep here for reference.
// const RADIUS = 1; // rem
// const GAP = 0.2; // rem
// const PADDING = 0.4; // rem
// const containerWidth =
//     Object.values(StatusEnum).length * (2 * RADIUS + GAP) - GAP;

interface MultiToggleProps {
    currentStatus: ItemStatus | "Mixed";
    setStatus: (status: ItemStatus) => void;
}

export function MultiToggle({ currentStatus, setStatus }: MultiToggleProps) {
    return (
        <Tabs
            value={currentStatus}
            onValueChange={(status) => setStatus(status as ItemStatus)}
        >
            <TabsList className="rounded-full gap-1">
                {Object.values(ItemStatus).map((status) => (
                    <TabsTrigger
                        className="p-0 w-8 h-8 rounded-full"
                        key={status}
                        value={status}
                    >
                        <StatusIcon status={status} size={18} />
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

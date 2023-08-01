import { fromUnixTime, intervalToDuration } from "date-fns";
import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "../utils";

interface DurationProps extends React.HTMLAttributes<HTMLDivElement> {
    time: number;
    iconSize?: number;
    textNumSize?: string;
    textUnitsSize?: string;
}

/**
 * Takes in a time value as a unix timestamp (seconds since epoch) and displays
 * a duration calculated by subtracting the time from the beginning of
 * the epoch.
 * Limitation: only works for up to 24 hrs
 */
const Duration = React.forwardRef<HTMLDivElement, DurationProps>(
    (
        {
            className,
            time,
            iconSize = 24,
            textNumSize = "text-xl",
            textUnitsSize = "text-base",
            ...props
        },
        ref,
    ) => {
        // Count seconds since start
        const [hrs, setHrs] = useState<string | undefined>(undefined);
        const [min, setMin] = useState<string | undefined>(undefined);
        const [sec, setSec] = useState<string>("0");

        useEffect(() => {
            const duration = intervalToDuration({
                start: 0,
                end: fromUnixTime(time),
            });
            // Limitation: hrs is modulo 24
            const hrs = duration.hours;
            const min = duration.minutes;
            const sec = duration.seconds;
            setHrs(hrs ? hrs.toString() : undefined);
            setMin(min ? min.toString().padStart(hrs ? 2 : 0, "0") : undefined);
            setSec(sec ? sec.toString().padStart(min ? 2 : 0, "0") : "0");
        }, [time]);

        return (
            <div
                ref={ref}
                className={cn("flex items-end gap-1", className)}
                {...props}
            >
                <Timer className="self-start" size={iconSize} />
                {hrs && (
                    <div>
                        <span className={cn("font-semibold", textNumSize)}>
                            {hrs}
                        </span>
                        <span className={textUnitsSize}>h</span>
                    </div>
                )}
                {min && (
                    <div>
                        <span className={cn("font-semibold", textNumSize)}>
                            {min}
                        </span>
                        <span className={cn(textUnitsSize)}>m</span>
                    </div>
                )}
                <div>
                    <span className={cn("font-semibold", textNumSize)}>
                        {sec}
                    </span>
                    <span className={cn(textUnitsSize)}>s</span>
                </div>
            </div>
        );
    },
);

Duration.displayName = "Duration";

export { Duration };

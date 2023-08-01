import { fromUnixTime, intervalToDuration } from "date-fns";
import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "../utils";

interface DurationProps extends React.HTMLAttributes<HTMLDivElement> {
    time: number;
}

/**
 * Takes in a time value as a unix timestamp (seconds since epoch) and displays
 * a duration calculated by subtracting the time from the beginning of
 * the epoch.
 * Limitation: only works for up to 24 hrs
 */
const Duration = React.forwardRef<HTMLDivElement, DurationProps>(
    ({ className, time, ...props }, ref) => {
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
                <Timer className="self-start" />
                {hrs && (
                    <div>
                        <span className="text-xl font-semibold">{hrs}</span>
                        <span className="text-base">h</span>
                    </div>
                )}
                {min && (
                    <div>
                        <span className="text-xl font-semibold">{min}</span>
                        <span className="text-base">m</span>
                    </div>
                )}
                <div>
                    <span className="text-xl font-semibold">{sec}</span>
                    <span className="text-base">s</span>
                </div>
            </div>
        );
    },
);

Duration.displayName = "Duration";

export { Duration };

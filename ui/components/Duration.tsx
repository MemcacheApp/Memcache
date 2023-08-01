import { fromUnixTime, intervalToDuration } from "date-fns";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

interface DurationProps {
    time: number;
}

/**
 * Takes in a time value as a unix timestamp (seconds since epoch) and displays
 * a duration calculated by subtracting the time from the beginning of
 * the epoch.
 * Limitation: only works for up to 24 hrs
 */
export default function Duration({ time }: DurationProps) {
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
        <div className="flex items-end gap-1">
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
}

import React from "react";
import { StatusEnum } from "@/src/app/utils/Statuses";
import { cn } from "../utils";
import { Button } from "./Button";
import { Archive, CheckCircle2, CircleDot, Inbox } from "lucide-react";

const StatusToggle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        activeStatus: StatusEnum;
        setActiveStatus: (status: StatusEnum) => void;
    }
>(({ className, activeStatus, setActiveStatus, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex space-x-3 overflow-auto", className)}
            {...props}
        >
            <Button
                variant={
                    activeStatus === StatusEnum.Inbox ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Inbox)}
            >
                <Inbox className="mr-2" size={18} />
                Inbox
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Underway ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Underway)}
            >
                <CircleDot className="mr-2" size={18} />
                Underway
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Complete ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Complete)}
            >
                <CheckCircle2 className="mr-2" size={18} />
                Complete
            </Button>
            <Button
                variant={
                    activeStatus === StatusEnum.Archive ? "default" : "outline"
                }
                onClick={() => setActiveStatus(StatusEnum.Archive)}
            >
                <Archive className="mr-2" size={18} />
                Archive
            </Button>
        </div>
    );
});
StatusToggle.displayName = "StatusToggle";

export { StatusToggle };

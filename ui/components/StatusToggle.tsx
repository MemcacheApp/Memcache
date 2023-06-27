import React from "react";
import classNames from "classnames";
import { StatusEnum, StatusNames } from "@/src/app/utils/Statuses";

const StatusToggle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        activeStatus: StatusEnum;
        setActiveStatus: (status: StatusEnum) => void;
    }
>(({ className, activeStatus, setActiveStatus, ...props }, ref) => {
    const statuses = [
        StatusEnum.Inbox,
        StatusEnum.Underway,
        StatusEnum.Complete,
        StatusEnum.Archive,
    ];

    return (
        <div
            ref={ref}
            className={classNames("flex space-x-6 my-5", className)}
            {...props}
        >
            {statuses.map((status) => (
                <button
                    key={status}
                    className={classNames(
                        "px-3 py-1 rounded-lg font-medium",
                        activeStatus === status
                            ? "border-2 border-gray-300 bg-gray-100"
                            : "border-0"
                    )}
                    onClick={() => setActiveStatus(status)}
                >
                    {StatusNames[status]}
                </button>
            ))}
        </div>
    );
});
StatusToggle.displayName = "Status Toggle";

export { StatusToggle };

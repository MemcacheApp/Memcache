"use client";
import React from "react";
import classNames from "classnames";
import { trpc } from "@/src/app/utils/trpc";

const DeleteContent = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { item: any }
>(({ className, item, ...props }, ref) => {
    const mutation = trpc.item.deleteItem.useMutation();

    const deleteItem = async () => {
        try {
            await mutation.mutateAsync({ id: item.id });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            ref={ref}
            className={classNames(
                "text-lg font-semibold leading-none tracking-tight",
                className
            )}
            onClick={deleteItem}
            {...props}
        >
            Delete
        </button>
    );
});
DeleteContent.displayName = "DeleteContent";

export { DeleteContent };

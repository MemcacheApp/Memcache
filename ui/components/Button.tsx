import { reviewRatingToColor } from "@/src/app/utils/flashcardReviewRating";
import { FlashcardReviewRating } from "@prisma/client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center font-medium transition-colors transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "bg-background border border-input hover:bg-accent hover:text-accent-foreground",
                shadow: "bg-background border border-input shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "underline-offset-4 hover:underline text-primary",
                icon: "w-8 h-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80",
            },
            size: {
                xs: "h-7 px-2 py-2 rounded-md text-sm",
                sm: "h-9 px-3 py-2 rounded-md text-sm",
                default: "h-10 px-4 py-2 rounded-md text-sm",
                lg: "h-11 px-8 rounded-lg text-sm",
                pillmd: "px-8 py-2 rounded-full text-lg",
                none: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

interface ReviewRatingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        ButtonProps {
    rating: FlashcardReviewRating;
}

const ReviewRatingButton = React.forwardRef<
    HTMLButtonElement,
    ReviewRatingButtonProps
>(({ className, rating, ...props }, ref) => {
    const colorName = reviewRatingToColor(rating);
    const colorClasses = `bg-${colorName}/50 shadow-[0_0_24px_-16px_rgba(0,0,0,0.53)] hover:bg-${colorName}/60 hover:shadow-[0_0_28px_-12px_rgba(0,0,0,0.53)] shadow-${colorName} hover:shadow-${colorName} text-slate-100/80 hover:text-slate-50/90`;
    return (
        <Button className={cn(colorClasses, className)} ref={ref} {...props}>
            {rating.toString()}
        </Button>
    );
});

ReviewRatingButton.displayName = "ReviewRatingButton";

export { Button, buttonVariants, ReviewRatingButton };

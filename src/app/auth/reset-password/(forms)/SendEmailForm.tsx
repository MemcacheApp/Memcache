"use client";

import { Mail } from "lucide-react";
import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ResetPasswordPage } from "../page";
import { Button, Input, Label } from "@/ui/components";

const emailFormSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

export default function SendEmailForm({
    sendVerificationCodeEmail,
    navigatePage,
    setEmail,
}: {
    sendVerificationCodeEmail: (email: string) => void;
    navigatePage: (newPage: ResetPasswordPage) => void;
    setEmail: (validEmail: string) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailFormSchema),
    });

    const { refetch } = trpc.user.isValidEmail.useQuery(
        { email: watch("email") },
        {
            refetchOnWindowFocus: false,
            enabled: false, // disable this query from automatically running
        }
    );

    const onSubmitPasswordResetEmail = async () => {
        const { data } = await refetch();
        if (data) {
            sendVerificationCodeEmail(watch("email"));
            setEmail(watch("email"));
        }
        navigatePage("verification-code");
    };

    return (
        <form
            action=""
            onSubmit={handleSubmit(onSubmitPasswordResetEmail)}
            className="flex flex-col items-center justify-center max-w-lg"
        >
            <Mail size={36} strokeWidth={1.75} />
            <h1 className="mt-4 text-3xl">Forgot password?</h1>
            <span className="m-10">
                Enter the email address associated with your account. A
                verification code will be sent.
            </span>

            <div className="flex flex-col w-full px-10">
                <Label htmlFor="email-input">Email</Label>
                <Input
                    id="email-input"
                    {...register("email", { required: true })}
                    className="mt-2 mb-1"
                />
                {errors.email && (
                    <span className="text-sm text-red-600/60">
                        {errors.email.message}
                    </span>
                )}
                <Button type="submit" className="my-5">
                    Send
                </Button>
            </div>

            <Link href={"/auth/login"}>
                <Button type="button" variant={"ghost"}>
                    Back to Login
                </Button>
            </Link>
        </form>
    );
}

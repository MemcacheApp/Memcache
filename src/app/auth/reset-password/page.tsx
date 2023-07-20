"use client";

import { Button, Input, Label } from "@/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

const emailFormSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

export default function ResetPasswordPage() {
    const { push } = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailFormSchema),
    });

    const sendResetEmailMutation = trpc.user.sendResetEmail.useMutation();

    const _onSubmit = handleSubmit((data) => {
        sendResetEmailMutation.mutate(
            { email: data.email },
            {
                onSuccess: () => {
                    push(
                        `/auth/reset-password/verification-code?email=${data.email}`,
                    );
                },
            },
        );
    });

    return (
        <div className="flex justify-center h-screen items-center">
            <form
                action=""
                onSubmit={_onSubmit}
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
                    <Button type="button" variant="ghost">
                        Back to Login
                    </Button>
                </Link>
            </form>
        </div>
    );
}

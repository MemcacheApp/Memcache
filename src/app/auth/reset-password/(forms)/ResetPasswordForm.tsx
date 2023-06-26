"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ResetPasswordPage } from "../page";
import { Button, Input, Label } from "@/ui/components";

const resetPasswordSchema = z.object({
    password: z.string().min(1, { message: "Password is required" }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm({
    navigatePage,
    email,
}: {
    navigatePage: (newPage: ResetPasswordPage) => void;
    email: string;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });
    const resetPasswordMutation = trpc.user.updatePassword.useMutation();
    const onSubmitPasswordReset = async (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate({ email, newPassword: data.password });
        navigatePage("success");
    };
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <form
            className="flex flex-col justify-center items-center w-[32rem]"
            action=""
            onSubmit={handleSubmit(onSubmitPasswordReset)}
        >
            <KeyRound size={36} strokeWidth={1.75} />
            <h1 className="text-3xl mt-4">Set new password</h1>
            <span className="m-10 flex flex-col">
                Please set a new password.
            </span>

            <div className="flex flex-col w-full px-10 relative">
                <Label htmlFor="password-input">Password</Label>
                <Input
                    id="password-input "
                    {...register("password", { required: true })}
                    className="mt-2 mb-1"
                    type={passwordShown ? "text" : "password"}
                />
                <button
                    onClick={() => setPasswordShown((prev) => !prev)}
                    className="w-fit absolute right-12 top-8"
                    type="button"
                >
                    {passwordShown ? (
                        <EyeOff size={20} color="grey" />
                    ) : (
                        <Eye size={20} color="grey" />
                    )}
                </button>
                {errors.password && (
                    <span className="text-sm text-red-600/60">
                        {errors.password.message}
                    </span>
                )}
                <Button type="submit" className="my-5">
                    Reset password
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
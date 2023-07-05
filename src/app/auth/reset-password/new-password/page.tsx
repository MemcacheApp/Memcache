"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Button, Input, Label } from "@/ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
    password: z.string().min(1, { message: "Password is required" }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function NewPasswordPage() {
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });
    const resetPasswordMutation = trpc.user.updatePassword.useMutation();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const email = searchParams.get("email")!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const code = searchParams.get("code")!;

    if (!email || !code) {
        push("/auth/reset-password");
    }

    const onSubmitPasswordReset = async (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate({
            email,
            code,
            newPassword: data.password,
        });
        push("/auth/reset-password/success");
    };
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <div className="flex justify-center h-screen items-center">
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
        </div>
    );
}

"use client";

import { useEffect } from "react";
import styles from "@/src/app/styles/forms.module.css";

import { Key } from "lucide-react";
import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordPage } from "../page";

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
    const resetPasswordMutation = trpc.users.updatePassword.useMutation();
    const onSubmitPasswordReset = async (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate({ email, newPassword: data.password });
        navigatePage("success");
    };

    return (
        <form
            className={styles["form-container"]}
            action=""
            onSubmit={handleSubmit(onSubmitPasswordReset)}
        >
            <div className={styles["header"]}>
                <Key size={36} />
                <h1 className={styles["form-title"]}>Forgot password?</h1>
            </div>
            <span>
                Enter the email address associated with your account. A
                verification code will be sent.
            </span>

            <div className={styles["form-field"]}>
                <label htmlFor="password-input">Password</label>
                <input
                    type="text"
                    id="password-input"
                    className={styles["input"]}
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <span className={styles["error-message"]}>
                        {errors.password.message}
                    </span>
                )}
            </div>

            <button type="submit" className={styles["submit-button"]}>
                Send
            </button>

            <p className={styles["link-nav"]}>
                <span>Back to </span>
                <Link href={"/login"}>Login</Link>
            </p>
        </form>
    );
}

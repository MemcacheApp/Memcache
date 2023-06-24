"use client";

import { useEffect } from "react";
import styles from "@/ui/styles/forms.module.css";

import { Key } from "lucide-react";
import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordPage } from "../page";

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
        // TODO: bug this doesnt return true the first time you click it
        if (data) {
            sendVerificationCodeEmail(watch("email"));
            setEmail(watch("email"));
            console.log("valid email");
        }
        navigatePage("verification-code");
    };

    return (
        <form
            className={styles["form-container"]}
            action=""
            onSubmit={handleSubmit(onSubmitPasswordResetEmail)}
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
                <label htmlFor="email-input">Email</label>
                <input
                    type="text"
                    id="email-input"
                    className={styles["input"]}
                    {...register("email", { required: true })}
                />
                {errors.email && (
                    <span className={styles["error-message"]}>
                        {errors.email.message}
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

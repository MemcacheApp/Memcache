"use client";

import { useState } from "react";
import SendEmailForm from "./(forms)/SendEmailForm";
import { trpc } from "@/src/app/utils/trpc";
import VerifyCodeForm from "./(forms)/VerifyCodeForm";
import ResetPasswordForm from "./(forms)/ResetPasswordForm";
import SuccessPage from "./(forms)/SuccessPage";

export type ResetPasswordPage =
    | "reset-password"
    | "verification-code"
    | "new-password"
    | "success";

export default function page() {
    const [code, setCode] = useState<string>("");
    const [page, setPage] = useState<ResetPasswordPage>("reset-password");
    const [email, setEmail] = useState<string>("");

    const sendEmailMutation = trpc.user.sendVerificationEmail.useMutation();

    const sendVerificationCodeEmail = async (email: string) => {
        const code = await sendEmailMutation.mutateAsync({ email });
        setCode(code);
    };

    return (
        <div className="flex justify-center h-screen items-center">
            {page === "reset-password" ? (
                <SendEmailForm
                    sendVerificationCodeEmail={sendVerificationCodeEmail}
                    navigatePage={(newPage: ResetPasswordPage) =>
                        setPage(newPage)
                    }
                    setEmail={(validEmail: string) => setEmail(validEmail)}
                />
            ) : page === "verification-code" ? (
                <VerifyCodeForm
                    code={code}
                    navigatePage={(newPage: ResetPasswordPage) =>
                        setPage(newPage)
                    }
                    email={email}
                    resendVerificationCodeEmail={() =>
                        sendVerificationCodeEmail(email)
                    }
                />
            ) : page === "new-password" ? (
                <ResetPasswordForm
                    navigatePage={(newPage: ResetPasswordPage) =>
                        setPage(newPage)
                    }
                    email={email}
                />
            ) : page === "success" ? (
                <SuccessPage />
            ) : (
                ""
            )}
        </div>
    );
}

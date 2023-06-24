"use client";

import { FormEvent, useState } from "react";
import styles from "@/src/app/styles/forms.module.css";
import { Key } from "lucide-react";
import Link from "next/link";
// import OtpInput from "../OtpInput";
import OtpInput from "react-otp-input";
import { ResetPasswordPage } from "../page";

type InputError = "white-space" | "invalid-code" | null;

export default function VerifyCodeForm({
    code,
    navigatePage,
}: {
    code: string;
    navigatePage: (newPage: ResetPasswordPage) => void;
}) {
    const [otp, setOtp] = useState("");
    const onChange = (value: string) => setOtp(value);

    const [error, setError] = useState<InputError>(null);

    const submitCode = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (/\s/g.test(otp) || otp.length < 6) {
            setError("white-space");
            return;
        } else if (otp !== code) {
            setError("invalid-code");
            return;
        }
        navigatePage("new-password");
    };

    return (
        <form
            className={styles["form-container"]}
            action=""
            onSubmit={submitCode}
        >
            <div className={styles["header"]}>
                <Key size={36} />
                <h1 className={styles["form-title"]}>Verify Code</h1>
            </div>
            <span>
                Enter the email address associated with your account. A
                verification code will be sent.
            </span>

            <div className={styles["form-field"]}>
                <label htmlFor="code-input">Code</label>

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                />
            </div>
            {error === "white-space" ? (
                <span className={styles["error-message"]}>
                    {"Please enter a 6-digit code"}
                </span>
            ) : error === "invalid-code" ? (
                <span className={styles["error-message"]}>
                    {"Incorrect code"}
                </span>
            ) : (
                ""
            )}

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

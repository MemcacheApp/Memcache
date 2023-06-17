import React from "react";
import styles from "@/styles/forms.module.css";
import SignUpForm from "./SignUpForm";

export default function page() {
    return (
        <div className={styles["page-container"]}>
            <SignUpForm />
        </div>
    );
}

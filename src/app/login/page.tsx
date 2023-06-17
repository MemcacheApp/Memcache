import React from "react";
import styles from "@/styles/forms.module.css";
import LoginForm from "./LoginForm";

export default function page() {
    return (
        <div className={styles["page-container"]}>
            <LoginForm />
        </div>
    );
}

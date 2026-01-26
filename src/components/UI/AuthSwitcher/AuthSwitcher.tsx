import { Dispatch, SetStateAction } from "react";
import styles from "./AuthSwitcher.module.css";

interface AuthSwitcherProps {
    selectedMethod: "login" | "signUp";
    setSelectedMethod: Dispatch<SetStateAction<"login" | "signUp">>;
}

export const AuthSwitcher = ({ selectedMethod, setSelectedMethod }: AuthSwitcherProps) => {
    return (
        <div className={styles.switcher}>
            <div className={`${styles.method} ${selectedMethod === "login" ? styles.active : ""}`} onClick={() => setSelectedMethod("login")}>Login</div>
            <div className={`${styles.method} ${selectedMethod === "signUp" ? styles.active : ""}`} data-testid="switcher-signup-btn" onClick={() => setSelectedMethod("signUp")}>Sign up</div>
        </div>
    );
}
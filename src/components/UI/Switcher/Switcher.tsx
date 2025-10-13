import { Dispatch, SetStateAction } from "react";
import styles from "./Switcher.module.css";

interface SwitcherProps{
    selectedMethod: "login" | "signUp";
    setSelectedMethod: Dispatch<SetStateAction<"login" | "signUp">>;
}

const Switcher = ({selectedMethod, setSelectedMethod}: SwitcherProps) => {
    return (
        <div className={styles.switcher}>
            <div className={`${styles.method} ${selectedMethod === "login" ? styles.active : ""}`} onClick={() => setSelectedMethod("login")}>Login</div>
            <div className={`${styles.method} ${selectedMethod === "signUp" ? styles.active : ""}`} onClick={() => setSelectedMethod("signUp")}>Sign up</div>
        </div>
    );
}

export default Switcher;
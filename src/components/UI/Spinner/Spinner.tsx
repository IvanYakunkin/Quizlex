import { CSSProperties } from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps {
    size?: number;
    outerColor?: string;
    innerColor?: string;
}

export const Spinner = ({ size, outerColor, innerColor }: SpinnerProps) => {
    const additionalStyles: CSSProperties = {
        width: size ?? 20,
        height: size ?? 20,
        border: `2px solid ${outerColor ?? "#f3f3f3"}`,
        borderTop: `2px solid ${innerColor ?? "#3498db"}`
    }

    return (
        <div className={styles.loading}>
            <div className={styles.spinner} style={additionalStyles}></div>
        </div>
    );
}
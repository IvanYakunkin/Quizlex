import Image from "next/image";
import styles from "./MatchPreview.module.css";
import { useEffect } from "react";

interface MatchPreviewProps {
    onStart: () => void;
}

export const MatchPreview = ({ onStart }: MatchPreviewProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                onStart();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [onStart]);

    return (
        <div>
            <div className={styles.centerWrapper}>
                <div className={styles.info}>
                    <div className={styles.contentContainer}>
                        <Image src="/images/card-games.png" width={180} height={180} alt="Cards Game" />
                        <h2>Are you ready?</h2>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.instruction}>Match all the terms and definitions as quickly as possible. Avoid mistakes — they add extra time!</div>
                    </div>
                    <div className={styles.contentContainer}>
                        <button onClick={onStart} className={styles.startButton}>Start the game</button>
                    </div>
                </div>
            </div>
            <div className={styles.footerSpacer}></div>
        </div>
    );
}
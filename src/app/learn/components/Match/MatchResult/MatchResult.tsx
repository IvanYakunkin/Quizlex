import Image from "next/image"
import styles from "./MatchResult.module.css";
import { ReloadIcon } from "@/icons/ReloadIcon";
import { useEffect } from "react";

interface MatchResultProps {
    seconds: number;
    playAgain: () => void;
}

export const MatchResult = ({ seconds, playAgain }: MatchResultProps) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                playAgain();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.addEventListener("keydown", handleKeyDown);
    })

    return (

        <div className={styles.result}>
            <div className={styles.titles}>
                <div className={styles.main}>
                    <h1 className={styles.title}>{seconds} seconds — you&apos;re doing great!</h1>
                    <Image src="/images/celebrate3.gif" width={200} height={200} alt="Congratulations Icon" />
                </div>
                <div className={styles.subtitle}>Try again, maybe you&apos;ll manage to beat your record!</div>
            </div>

            <button onClick={playAgain} className={styles.startButton}>
                <svg viewBox="0 0 24 24" width={25} height={25} strokeWidth="2" fill="transparent" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><ReloadIcon /></svg> &nbsp;
                <span>Play again</span>
            </button>
            <div className={styles.footerSpacer}></div>
        </div>
    );
}
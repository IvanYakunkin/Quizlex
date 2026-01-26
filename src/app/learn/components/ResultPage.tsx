import { CardsPreview } from "@/components/UI/CardsPreview/CardsPreview";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "../page.module.css";
import { useParams, useRouter } from "next/navigation";
import { BaseCard } from "@/types/module";
import ReactConfetti from "react-confetti";
import { Button } from "@/components/UI/Button/Button";

interface ResultPageProps<T extends BaseCard> {
    cards: T[];
    changeCards?: React.Dispatch<React.SetStateAction<T[]>>;
    closeResultPage: () => void;
    isGameOver: boolean;
    language: string;
    title?: string;
    additionalText?: string;
}

export const ResultPage = <T extends BaseCard>(props: ResultPageProps<T>) => {
    const router = useRouter();
    const { id } = useParams();

    const learnNext = useCallback(() => {
        if (props.isGameOver) {
            router.push("/module");
        }

        props.closeResultPage();
    }, [router, props]);

    const toHome = () => {
        if (id) {
            router.push(`/module/${id}`);
        } else {
            router.push('/module/');
        }
    }

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (event.code === "Space" || event.code === "Enter") {
                event.preventDefault();
                learnNext();
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }

    }, [learnNext]);

    return (
        <div className={styles.result}>
            {props.isGameOver &&
                <ReactConfetti
                    initialVelocityY={120}
                    gravity={0.3}
                    numberOfPieces={3000}
                    recycle={false}
                />}
            <div className={styles.status}>{props.title ? props.title : "At this stage you have studied:"}</div>
            {props.isGameOver && <div className={styles.congratulations}><Image src="/images/celebrate3.gif" width={200} height={200} alt="Congratulations Icon" /></div>}
            <CardsPreview
                cards={props.cards}
                changeCards={props.changeCards}
                showNumbers={false}
                showOptions={true}
                language={props.language}
                additionalText={props.additionalText !== undefined ? props.additionalText : undefined}
            />

            {!props.isGameOver &&
                <div className={styles.resultBtn}><Button onClick={learnNext} size="lg" background="primary" isBold>Next</Button></div>
            }
            {props.isGameOver &&
                <div className={styles.resultBtn}><Button onClick={toHome} size="lg" background="primary" isBold>Home</Button></div>
            }
        </div>
    )
}
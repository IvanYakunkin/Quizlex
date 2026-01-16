import CardsPreview from "@/components/UI/CardsPreview/CardsPreview";
import { Card } from "@/types/types";
import { useCallback, useEffect } from "react";
import Image from "next/image";
import styles from "../page.module.css";
import { useParams, useRouter } from "next/navigation";

interface ResultPageProps {
    cards: Card[];
    setCards?: React.Dispatch<React.SetStateAction<Card[]>>
    closeResultPage: () => void;
    isGameOver: boolean;
    language: string;
    title?: string;
    additionalText?: string;
}

const ResultPage = (props: ResultPageProps) => {
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
            <div className={styles.status}>{props.title ? props.title : "At this stage you have studied:"}</div>
            {props.isGameOver && <div className={styles.congratulations}><Image src="/images/celebrate3.gif" width={200} height={200} alt="Congratulations Icon" /></div>}
            <CardsPreview
                cards={props.cards}
                setCards={props.setCards}
                showNumbers={false}
                showOptions={true}
                language={props.language}
                additionalText={props.additionalText !== undefined ? props.additionalText : undefined}
            />

            {!props.isGameOver && <div className={styles.next} onClick={learnNext}>Next</div>}
            {props.isGameOver && <div className={styles.next} onClick={toHome}>Home</div>}
        </div>
    )
}

export default ResultPage;
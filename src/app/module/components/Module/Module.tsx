"use client"

import { Card, Languages, ModuleInterface, WordsModule } from "@/types/types";
import CardsPreview from "@/components/UI/CardsPreview/CardsPreview";
import { Slider } from "@/components/UI/Slider/Slider";
import { useEffect, useRef, useState } from "react";
import DeleteWin from "@/components/popups/DeleteWin";
import EditWin from "@/components/popups/EditWin";
import LearningTypes from "./LearningTypes";
import styles from "./Module.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ModuleOptions } from "./ModuleOptions/ModuleOptions";
import { updateCard } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

interface SliderRef {
    refreshCards: () => void;
    switchDefaultSides: () => void;
}

interface ModuleProps {
    moduleData?: WordsModule | null;
}

const defaultLanguages = { term: "en-EN", definition: "en-En" };

export const Module = ({ moduleData }: ModuleProps) => {
    const { status } = useSession();
    const router = useRouter();

    const [cards, setCards] = useState<Card[]>((moduleData && moduleData.cards) ? moduleData.cards : []);
    const [languages, setLanguages] = useState<Languages>(moduleData ? { term: moduleData.termLanguage.code, definition: moduleData.definitionLanguage.code } : defaultLanguages);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [isDeleteWin, setIsDeleteWin] = useState(false);
    const [isEditWin, setIsEditWin] = useState(false);
    const sliderRef = useRef<SliderRef>(null);

    useEffect(() => {
        const getModuleFromLocalStorage = () => {
            const localRawModule = localStorage.getItem("module");
            if (localRawModule) {
                const localModule: ModuleInterface = JSON.parse(localRawModule);
                setCards(localModule.cards);
                setLanguages(localModule.languages);
            } else {
                router.push("/import");
            }
        }

        if (!cards || !cards.length) {
            getModuleFromLocalStorage();
        }
    }, [cards, router]);

    useEffect(() => {
        if (isDeleteWin || isEditWin) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDeleteWin, isEditWin]);

    const callRefreshCards = () => {
        if (sliderRef.current) {
            sliderRef.current.refreshCards();
        }
    }

    const callSwitchDefaultSides = () => {
        if (sliderRef.current) {
            sliderRef.current.switchDefaultSides();
        }
    }

    const editOneCard = async (id: number, newCard: Card) => {
        try {
            await updateCard(id, newCard);
        } catch (error) {
            console.error(error);
        }
    }

    const editCards = async (newCard: Card) => {
        const updatedCards = cards.map(card => card.id === newCard.id ? newCard : card);
        setCards(updatedCards);

        if (status === "authenticated") {
            if (moduleData) {
                await editOneCard(moduleData.id, newCard);
            }
        } else {
            // Update Local Storage
            const storedData = localStorage.getItem('module');
            if (storedData) {
                const cardsModule = JSON.parse(storedData);
                cardsModule.terms = updatedCards;
                localStorage.setItem('module', JSON.stringify(cardsModule));
            }
        }
    }

    return (
        <main>
            {cards && cards.length > 0 && <div>
                {isDeleteWin && (
                    <DeleteWin
                        moduleId={moduleData ? moduleData.id : undefined}
                        onClose={() => setIsDeleteWin(false)}
                    />
                )}

                {isEditWin && (
                    <EditWin
                        moduleId={moduleData ? moduleData.id : undefined}
                        onClose={() => setIsEditWin(false)}
                        card={cards[currentCardId]}
                        save={editCards}
                    />
                )}

                <div className={styles.module}>

                    <div className={styles.title}>{moduleData ? moduleData.name : "Your Module"}</div>
                    <div className={styles.subtitle}>{moduleData ? moduleData.description : "You can learn it now!"}</div>

                    <LearningTypes />

                    <Slider
                        cards={cards}
                        setCards={setCards}
                        sliderRef={sliderRef}
                        languages={languages}
                        currentCardId={currentCardId}
                        setCurrentCardId={setCurrentCardId}
                    />

                    <ModuleOptions
                        onDeleteClick={() => setIsDeleteWin(true)}
                        onEditClick={() => setIsEditWin(true)}
                        onRefreshClick={callRefreshCards}
                        onSwitchSidesClick={callSwitchDefaultSides}
                    />

                    <div className={styles.wordsCounter}>
                        <div className={styles.wordsCounterLine}><span>{cards.length} Words</span></div>
                    </div>

                    <CardsPreview
                        title=""
                        showNumbers={false}
                        showOptions={true}
                        cards={cards}
                        setCards={setCards}
                        language={languages.term}
                    />
                    {moduleData &&
                        <Link href={`/module/${moduleData.id}/edit`} className={styles.updateButton}>
                            <Image src="/images/pen-white.png" width={20} height={20} alt="Pen" />
                            <span>Add or remove words</span>
                        </Link>
                    }
                </div>
            </div>}
        </main>
    );
}
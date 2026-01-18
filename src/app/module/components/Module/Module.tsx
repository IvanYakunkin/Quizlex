"use client"

import { Card, Languages, ModuleInterface } from "@/types/types";
import CardsPreview from "@/components/UI/CardsPreview/CardsPreview";
import { Slider } from "@/components/UI/Slider/Slider";
import { useEffect, useRef, useState } from "react";
import DeleteWin from "@/components/popups/DeleteWin";
import EditWin from "@/components/popups/EditWin";
import LearningTypes from "./LearningTypes";
import styles from "./Module.module.css";
import { useRouter } from "next/navigation";
import { ModuleOptions } from "./ModuleOptions/ModuleOptions";
import { updateCard } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { UserModule } from "@/services/moduleService";

interface SliderRef {
    refreshCards: () => void;
    switchDefaultSides: () => void;
}

interface ModuleProps {
    userModule?: NonNullable<UserModule>;
}

const defaultLanguages = { term: "en-EN", definition: "en-En" };

export const Module = ({ userModule }: ModuleProps) => {
    const router = useRouter();

    const [cards, setCards] = useState<Card[]>((userModule && userModule.cards) ? userModule.cards : []);
    const [languages, setLanguages] = useState<Languages>(userModule ? { term: userModule.termLanguage.code, definition: userModule.definitionLanguage.code } : defaultLanguages);
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

    const editCards = async (newCard: Card) => {
        const updatedCards = cards.map(card => card.id === newCard.id ? newCard : card);
        setCards(updatedCards);
        if (userModule) {
            await updateCard(userModule.id, newCard);
        }
        else {
            // Update Local Storage
            const storedData = localStorage.getItem('module');
            if (storedData) {
                const cardsModule = JSON.parse(storedData);
                cardsModule.cards = updatedCards;
                localStorage.setItem('module', JSON.stringify(cardsModule));
            }
        }
    }

    return (
        <main>
            {cards && cards.length > 0 && <div>
                {isDeleteWin && (
                    <DeleteWin
                        moduleId={userModule ? userModule.id : undefined}
                        onClose={() => setIsDeleteWin(false)}
                    />
                )}

                {isEditWin && (
                    <EditWin
                        moduleId={userModule ? userModule.id : undefined}
                        onClose={() => setIsEditWin(false)}
                        card={cards[currentCardId]}
                        save={editCards}
                    />
                )}

                <div className={styles.module}>

                    <div className={styles.title}>{userModule ? userModule.name : "Your Module"}</div>
                    <div className={styles.subtitle}>{userModule ? userModule.description : "You can learn it now!"}</div>

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
                    {userModule &&
                        <Link href={`/module/${userModule.id}/edit`} className={styles.updateButton}>
                            <Image src="/images/pen-white.png" width={20} height={20} alt="Pen" />
                            <span>Add or remove words</span>
                        </Link>
                    }
                </div>
            </div>}
        </main>
    );
}
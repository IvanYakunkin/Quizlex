"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { ValidationErrors } from '@/types/types';
import { Select } from '@/components/UI/SelectLanguage/Select';
import styles from "./ModuleForm.module.css";
import { useRouter } from 'next/navigation';
import { validateAndSanitize } from '@/utils/module/validateModule';
import { Language } from '@/generated/prisma/browser';
import { CreateCard } from './CreateCard/CreateCard';
import { AppModule, BaseCard, CreateModuleInput } from '@/types/module';
import { createModuleAction, updateModuleAction } from '@/services/moduleActions';
import { Spinner } from '../UI/Spinner/Spinner';

const emptyCard = { id: 0, term: "", definition: "", isFavorite: false };

interface ModuleFormProps {
    languagesList: Language[];
    initialModule?: AppModule;
}

// TODO: 1) Re-renders could be optimized!
export const ModuleForm = ({ languagesList, initialModule }: ModuleFormProps) => {
    const [cards, setCards] = useState<BaseCard[]>(initialModule ? initialModule.cards : [emptyCard]);
    const [termLanguage, setTermLanguage] = useState(initialModule?.termLanguage || languagesList[0]);
    const [definitionLanguage, setDefinitionLanguage] = useState(initialModule?.termLanguage || languagesList[0]);

    const [formErrors, setFormErrors] = useState<ValidationErrors>();
    const [createdCardIndex, setCreatedCardIndex] = useState<number | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const router = useRouter();

    // TODO: use createdCardId instead
    const newCardAdded = useRef(false);

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionInputRef = useRef<HTMLInputElement | null>(null);

    const addCard = useCallback(() => {
        setCards([...cards, { ...emptyCard, id: cards[cards.length - 1].id + 1 }]);
        setCreatedCardIndex(cards.length);
        newCardAdded.current = true;
    }, [cards]);

    const deleteCard = (id: number) => {
        if (cards.length !== 1) {
            setCards(cards.filter((_, index) => index !== id));
        }
    }

    const saveCards = async () => {
        const name = nameInputRef.current?.value || "";
        const description = descriptionInputRef.current?.value || "";
        const { isValid, errors, sanitizedCards } = validateAndSanitize(name, description, cards);

        if (!isValid) {
            setFormErrors(errors);
            if (errors.name) nameInputRef.current?.focus();
            else if (errors.description) descriptionInputRef.current?.focus();
            else if (errors.cards) alert(errors.cards);

            return false;
        }
        if (nameInputRef.current && descriptionInputRef.current) {
            setSaveLoading(true);
            let redirectModuleId;
            const newModule: CreateModuleInput = {
                name,
                description,
                termLanguageId: termLanguage.id,
                definitionLanguageId: definitionLanguage.id,
                cards: sanitizedCards
            }

            if (initialModule) { // Update
                const updatedModule = await updateModuleAction(+initialModule.id, newModule);
                if (updatedModule.success && updatedModule.data) {
                    redirectModuleId = updatedModule.data.id;
                } else {
                    alert("Error updating module");
                }
            } else { // Create
                const createdModule = await createModuleAction(newModule);
                if (createdModule.success && createdModule.data) {
                    redirectModuleId = createdModule.data.id;
                } else {
                    alert("Error creating module");
                }
            }
            setSaveLoading(false);
            router.push(`/module/${redirectModuleId}`);
        }
    }

    // Scroll down
    useEffect(() => {
        if (newCardAdded.current) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
        newCardAdded.current = false;
    }, [newCardAdded]);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                const children = document.querySelectorAll(".create__content");
                if (children) {
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if (document.activeElement === lastField) {
                        addCard();
                    }
                }
            } else if (event.key === "Tab") {
                // Check if focus on the last element
                const children = document.querySelectorAll(".create__content");
                if (children) {
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if (document.activeElement === lastField) {
                        event.preventDefault();
                        addCard();
                    }
                }
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [cards, addCard]);

    return (
        <main className="main">
            <div className={styles.moduleForm}>
                {!initialModule &&
                    <div className={styles.title}>Create a new module</div>
                }
                <div className={styles.info}>
                    <div className={styles.infoFields}>
                        <input
                            type="text" ref={nameInputRef}
                            className={!formErrors?.name ? styles.field : `${styles.field} ${styles.error}`}
                            defaultValue={initialModule ? initialModule.name : ""}
                            placeholder='Name'
                            autoFocus
                        />
                        <input
                            type='text'
                            ref={descriptionInputRef}
                            className={!formErrors?.description ? styles.field : `${styles.field} ${styles.error}`}
                            defaultValue={initialModule ? initialModule.description : ""}
                            placeholder='Description'
                        />
                    </div>
                    <div className={styles.buttonSave} onClick={saveCards}>{saveLoading ? <Spinner /> : "Save"}</div>
                </div>
                <div className={styles.languages}>
                    <div className={styles.language}>
                        <Select languages={languagesList}
                            label="Original Language"
                            selectedLanguage={termLanguage}
                            changeLanguage={setTermLanguage}
                        />
                    </div>
                    <div className={styles.language}>
                        <Select
                            languages={languagesList}
                            label="Translation Language"
                            selectedLanguage={definitionLanguage}
                            changeLanguage={setDefinitionLanguage}
                        />
                    </div>
                </div>
                <div className={styles.createContainer + " create__content"}>
                    {cards.map((el, id) => (
                        <CreateCard
                            key={el.id}
                            setCards={setCards}
                            deleteCard={deleteCard}
                            card={el}
                            cardId={id}
                            useFocus={createdCardIndex === id}
                        />
                    ))}
                </div>
                <div className={styles.addCard} onMouseDown={(e) => { e.preventDefault(); addCard(); }}>
                    Add Card
                </div>
            </div>
        </main >
    )
}
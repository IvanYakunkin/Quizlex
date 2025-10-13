"use client"

import CreateCard from './CreateCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Languages } from '@/types/types';
import Select from '@/components/UI/SelectLanguage/Select';
import styles from "../page.module.css";
import { Language } from '@/generated/prisma';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { validateFields } from '@/utils/validateModule';
import { createModuleDB, createModuleLS } from '@/utils/createModule';

const emptyCard = {id: 0, term: "", definition: "", isFavorite: false};

interface CreateProps{
    languages: Language[];
}

// TODO: 1) Re-renders could be optimized!
const Create = ({languages}: CreateProps) => {
    const [cards, setCards] = useState<Card[]>([emptyCard]);
    const [nameInputError, setNameInputError] = useState(false);
    const [descriptionInputError, setDescriptionInputError] = useState(false);
    const [newCardAdded, setNewCardAdded] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState<Languages>({term: "en-EN", definition: "en-EN"});
    const { status } = useSession();
    const router = useRouter();

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionInputRef = useRef<HTMLInputElement | null>(null);
    
    const addCard = useCallback(() => {
        setCards([...cards, {...emptyCard, id: cards[cards.length-1].id+1}]);
        setNewCardAdded(true);
    }, [cards]);

    const deleteCard = (id: number) => {
        if(cards.length !== 1){
            setCards(cards.filter((_, index) => index !== id));
        }
    }

    const saveCards = async() => {
        const isValidate = validateFields({nameInputRef, setNameInputError, descriptionInputRef, setDescriptionInputError, cardsLength: cards.length});

        if(isValidate && nameInputRef.current && descriptionInputRef.current){
            if(status === "authenticated"){
                const createdModule = await createModuleDB({
                    name: nameInputRef.current.value, 
                    description: descriptionInputRef.current.value, 
                    cards: cards, 
                    languages: languages, 
                    selectedLanguages,
                });

                const moduleUrl = `/module/${createdModule.id}`;
                router.push(moduleUrl);
            }else{
                createModuleLS(cards, selectedLanguages);
                router.push("/module");
            }
        }
    }

    // Scroll down
    useEffect(() => {
        if(newCardAdded){
                window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
        setNewCardAdded(false)
    }, [newCardAdded]);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if(event.key === "Enter"){
                const children = document.querySelectorAll(".create__content");
                if(children){
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if(document.activeElement === lastField){
                        addCard();
                    }
                }
            }else if(event.key === "Tab"){
                // Check if focus on the last element
                const children = document.querySelectorAll(".create__content");
                if(children){
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if(document.activeElement === lastField){
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

    const setTermLang = (value: string) => {
        setSelectedLanguages({...selectedLanguages, term: value});
    }

    const setDefinitionLang = (value: string) => {
        setSelectedLanguages({...selectedLanguages, definition: value});
    }

    return (
        <main className="main">
            <div className={styles.create}>
                <div className={styles.title}>Create a new module</div>
                <div className={styles.info}>
                    <div className={styles.infoFields}>
                        <input type="text" ref={nameInputRef} className={!nameInputError ? styles.moduleField : `${styles.moduleField} ${styles.error}`} placeholder='Name'/>
                        <input type='text' ref={descriptionInputRef} className={!descriptionInputError ? styles.moduleField : `${styles.moduleField} ${styles.error}`} placeholder='Description' />
                    </div>
                    <div className={styles.buttonSave} onClick={saveCards}>Save</div>
                </div>
                <div className={styles.languages}>
                    <div className={styles.language}>
                        <Select languages={languages} label="Original Language" selectedValue={selectedLanguages.term} setLanguage={setTermLang}></Select>
                    </div>
                    <div className={styles.language}>
                        <Select languages={languages} label="Translation Language" selectedValue={selectedLanguages.definition} setLanguage={setDefinitionLang}></Select>
                    </div>
                </div>
                <div className={styles.content + " " + "create__content"}>
                    {cards.map((el, id) => (
                        <CreateCard 
                            key={el.id} 
                            setCards={setCards} 
                            deleteCard={deleteCard} 
                            card={el} 
                            cardId={id} 
                        />
                    ))}
                </div>
                <div className={styles.addCard} onMouseDown={(e) => {e.preventDefault();addCard();}}>
                    Add Card
                </div>
            </div>
        </main>
    )
}

export default Create;
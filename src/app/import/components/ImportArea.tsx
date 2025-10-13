import { useState, useRef } from "react";
import ImportTextarea from "@/components/UI/ImportTextarea/ImportTextarea";
import { ISeparators, Card, Languages } from "@/types/types";
import Select from "@/components/UI/SelectLanguage/Select";
import Separators from "./Separators";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Language } from "@/generated/prisma";
import { validateFields } from "@/utils/validateModule";
import { createModuleDB, createModuleLS } from "@/utils/createModule";

interface ImportAreaProps{
    previewCards: Card[];
    setPreviewCards: React.Dispatch<React.SetStateAction<Card[]>>;
    languages: Language[];
}

const separators: ISeparators[] = [
    {name: "Tab", value: "\t"},
    {name: "Space", value: " "},
    {name: ",", value: ","},
    {name: "-", value: "-"},
];

const ImportArea = (props: ImportAreaProps) => {
    const router = useRouter();
    const {status} = useSession();
    const [activeSeparatorId, setActiveSeparatorId] = useState<number>(0);
    const [selectedLanguages, setSelectedLanguages] = useState<Languages>({term: "en-EN", definition: "en-EN"});
    const [buttonLoading, setButtonLoading] = useState(false);
    const [nameInputError, setNameInputError] = useState(false);
    const [descriptionInputError, setDescriptionInputError] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    
    const saveWords = async () => {
        setButtonLoading(true);

        const isValidate = validateFields({
            nameInputRef, 
            setNameInputError, 
            descriptionInputRef, 
            setDescriptionInputError, 
            cardsLength: props.previewCards.length, 
            textareaRef
        });
        
        if(isValidate && nameInputRef.current && descriptionInputRef.current){
            if(status === "authenticated"){ // Save to DB
                const createdModule = await createModuleDB({
                    name: nameInputRef.current.value, 
                    description: descriptionInputRef.current.value, 
                    cards: props.previewCards, 
                    languages: props.languages, 
                    selectedLanguages
                });

                if(createdModule){
                    const moduleUrl = `/module/${createdModule.id}`;
                    router.push(moduleUrl);
                }

            }else{ // Save to LS
                createModuleLS(props.previewCards, selectedLanguages);
                router.push("/module");
            }
        }
        
        setButtonLoading(false);
    }

    const setTermLang = (value: string) => {
        setSelectedLanguages({...selectedLanguages, term: value});
    }

    const setDefinitionLang = (value: string) => {
        setSelectedLanguages({...selectedLanguages, definition: value});
    }

    return (
        <div className={styles.importArea}>
             <div className={styles.infoFields}>
                <input type="text" ref={nameInputRef} className={!nameInputError ? styles.moduleField : `${styles.moduleField} ${styles.error}`} placeholder='Name'/>
                <input type='text' ref={descriptionInputRef} className={!descriptionInputError ? styles.moduleField : `${styles.moduleField} ${styles.error}`} placeholder='Description' />
            </div>
            <div className={styles.languages}>
                <div className={styles.language}>
                   <Select label="Original Language" languages={props.languages} selectedValue={selectedLanguages.term} setLanguage={setTermLang} />
                </div>
                <div className={styles.language}>
                   <Select label="Translation Language" languages={props.languages} selectedValue={selectedLanguages.definition} setLanguage={setDefinitionLang} />
                </div>
            </div>

            <div className={styles.info}><b>Paste</b> your words here and learn!</div>

            <div className={styles.importContainer}>
                <div className={styles.areaContent}>
                    
                    <ImportTextarea separator={separators[activeSeparatorId].value} setPreview={props.setPreviewCards} textareaRef={textareaRef} />
                    
                    <div className={styles.menu}>
                        <Separators 
                            separators={separators}
                            activeSeparatorId={activeSeparatorId}
                            setActiveSeparatorId={setActiveSeparatorId}
                        />
                        <div className={`${styles.baseButton} ${styles.buttonSave}`} onClick={saveWords}>{buttonLoading 
                        ? 
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                        </div>
                        : 
                        "Save"
                        }
                    </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ImportArea;

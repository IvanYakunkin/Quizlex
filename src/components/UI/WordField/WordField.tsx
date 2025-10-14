import { memo, useEffect, useRef } from "react";
import FieldWithLetters from "./FieldWithLetters";
import { Card } from "@/types/types";
import styles from "./WordField.module.css";

interface WordFieldProps{
    cardId?: number;
    card: Card;
    updateTerm: (value: string, id?: number) => void;
    updateDefinition: (value: string, id?: number) => void;
}

const WordField = (props: WordFieldProps) => {

    const termInputRef = useRef<HTMLInputElement>(null);
    const definitionInputRef = useRef<HTMLInputElement>(null);

    // Set focus when created
    useEffect(() => {
        termInputRef.current?.focus();
    }, []);

    return (
        <div className={styles.content}>
            <div>
                <FieldWithLetters ref={termInputRef} value={props.card.term || ""} language="german" placeholder="Word" onChange={props.updateTerm} /> 
            </div>
            <div>
                <FieldWithLetters ref={definitionInputRef} value={props.card.definition || ""} language="russian" placeholder="Definition" onChange={props.updateDefinition} /> 
            </div>
        </div>
    );
};

export default memo(WordField);
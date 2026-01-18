import { memo, useEffect, useRef } from "react";
import { FieldWithLetters } from "./FieldWithLetters";
import { Card } from "@/types/types";
import styles from "./WordField.module.css";

interface WordFieldProps {
    cardId?: number;
    card: Card;
    updateTerm: (value: string, id?: number) => void;
    updateDefinition: (value: string, id?: number) => void;
    useFocus?: boolean;
}

const WordField = (props: WordFieldProps) => {

    const termInputRef = useRef<HTMLInputElement>(null);
    const definitionInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.useFocus && termInputRef.current) {
            termInputRef.current.focus();
        }
    }, [props.useFocus]);

    return (
        <div className={styles.content}>
            <div>
                <FieldWithLetters
                    ref={termInputRef}
                    value={props.card.term || ""}
                    onChange={props.updateTerm}
                    language="german"
                    placeholder="Word"
                />
            </div>
            <div>
                <FieldWithLetters
                    ref={definitionInputRef}
                    value={props.card.definition || ""}
                    onChange={props.updateDefinition}
                    language="russian"
                    placeholder="Definition"
                />
            </div>
        </div>
    );
};

export default memo(WordField);
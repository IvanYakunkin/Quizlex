import { memo, useEffect, useRef } from "react";
import { FieldWithLetters } from "./FieldWithLetters";
import styles from "./WordField.module.css";
import { BaseCard } from "@/types/module";

interface WordFieldProps {
    card: BaseCard;
    updateTerm: (value: string, id?: number) => void;
    updateDefinition: (value: string, id?: number) => void;
    useFocus?: boolean;
    onDefinitionKeyDown?: (e: React.KeyboardEvent) => void;
}

export const WordField = memo((props: WordFieldProps) => {

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
                    onDefinitionKeyDown={props.onDefinitionKeyDown}
                />
            </div>
        </div>
    );
});

WordField.displayName = "WordField";
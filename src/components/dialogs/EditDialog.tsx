"use client"

import { useState } from "react";
import { WordField } from "../UI/WordField/WordField";
import styles from "./windows.module.css";
import { BaseCard } from "@/types/module";
import { BaseDialog } from "./BaseDialog/BaseDialog";
import { Button } from "../UI/Button/Button";

interface EditDialogProps {
    isOpen: boolean;
    card: BaseCard;
    onClose: () => void;
    save: (newCard: BaseCard) => void;
}

export const EditDialog = (props: EditDialogProps) => {
    const [localCard, setLocalCard] = useState<BaseCard>(props.card);

    const updateTerm = (value: string) => {
        setLocalCard({ ...localCard, term: value });
    }

    const updateDefinition = (value: string) => {
        setLocalCard({ ...localCard, definition: value });
    }

    const saveChanges = () => {
        props.save(localCard);
        props.onClose();
    }

    return (
        <BaseDialog
            isOpen={props.isOpen}
            onClose={props.onClose}
            title="Edit card"
            size="big"
            footerButtons={
                <>
                    <Button className={styles.btnCancel} onClick={props.onClose} background="empty">Cancel</Button>
                    <Button className={styles.btnSuccess} width="150px" onClick={saveChanges}>Save</Button>
                </>
            }
        >
            <WordField
                card={localCard}
                updateTerm={updateTerm}
                updateDefinition={updateDefinition}
            />

        </BaseDialog>
    );
}
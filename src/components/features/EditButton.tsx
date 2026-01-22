import { BaseCard } from "@/types/module";
import { EditWin } from "../popups/EditWin";
import { IconAction } from "../UI/IconAction/IconAction";
import { PencilIcon } from "@/icons/PencilIcon";
import { useState } from "react";

interface EditButtonProps {
    card: BaseCard;
    onSave: (newCard: BaseCard) => void;
}

export const EditButton = ({ card, onSave }: EditButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IconAction
                title="Edit"
                onClick={() => setIsOpen(prev => !prev)}
                hoverColor="var(--blue-color-400)"
            >
                <PencilIcon />
            </IconAction>

            {isOpen && (
                <EditWin
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    card={card}
                    save={onSave}
                />
            )}
        </>
    );
};
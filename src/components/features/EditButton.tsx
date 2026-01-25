import { BaseCard } from "@/types/module";
import { IconAction } from "../UI/IconAction/IconAction";
import { PencilIcon } from "@/icons/PencilIcon";
import { memo, useCallback, useMemo, useState } from "react";
import { EditDialog } from "../dialogs/EditDialog";

interface EditButtonProps {
    card: BaseCard;
    onSave: (newCard: BaseCard) => void;
}

export const EditButton = memo(({ card, onSave }: EditButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const icon = useMemo(() => <PencilIcon />, []);

    return (
        <>
            <IconAction
                title="Edit"
                onClick={handleToggle}
                hoverColor="var(--blue-color-400)"
            >
                {icon}
            </IconAction>

            {isOpen && (
                <EditDialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    card={card}
                    save={onSave}
                />
            )}
        </>
    );
});

EditButton.displayName = "EditButton";
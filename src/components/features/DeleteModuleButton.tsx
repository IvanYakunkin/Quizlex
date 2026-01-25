import { TrashIcon } from "@/icons/TrashIcon"
import { IconAction } from "../UI/IconAction/IconAction"
import { useState } from "react"
import { DeleteDialog } from "../dialogs/DeleteDialog";

interface DeleteModuleButtonProps {
    moduleId: number | string;
    moduleName: string;
}

export const DeleteModuleButton = ({ moduleId, moduleName }: DeleteModuleButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IconAction
                title="Delete"
                onClick={() => setIsOpen(prev => !prev)}
                hoverColor="var(--blue-color-400)"
                variant="background"
            >
                <TrashIcon />
            </IconAction>

            {isOpen &&
                <DeleteDialog isOpen={isOpen} moduleId={moduleId} moduleName={moduleName} onClose={() => setIsOpen(false)} />
            }
        </>
    )
}
import { memo, useMemo } from "react";
import { IconAction } from "../UI/IconAction/IconAction"
import { TrashIcon } from "@/icons/TrashIcon";

interface DeleteButtonProps {
    onBtnClick: () => void;
    tabIndex?: number;
}

export const DeleteButton = memo(({ onBtnClick, tabIndex }: DeleteButtonProps) => {

    const icon = useMemo(() => <TrashIcon />, []);

    return (
        <>
            <IconAction
                title="Delete"
                onClick={onBtnClick}
                hoverColor="var(--blue-color-400)"
                variant="background"
                tabIndex={tabIndex}
            >
                {icon}
            </IconAction>
        </>
    )
});

DeleteButton.displayName = "DeleteButton";
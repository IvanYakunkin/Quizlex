import { memo, useMemo } from "react";
import { IconAction } from "../UI/IconAction/IconAction"
import { CloseIcon } from "@/icons/CloseIcon";

interface CloseButtonProps {
    onBtnClick: () => void;
    size?: number;
}

export const CloseButton = memo(({ onBtnClick, size }: CloseButtonProps) => {

    const icon = useMemo(() => <CloseIcon />, []);

    return (
        <>
            <IconAction
                title="Close"
                onClick={onBtnClick}
                hoverColor="var(--blue-color-400)"
                size={size}
                variant="background"
            >
                {icon}
            </IconAction>
        </>
    )
});

CloseButton.displayName = "CloseButton";
import { StarIcon } from "@/icons/StarIcon";
import { IconAction } from "../UI/IconAction/IconAction";
import { memo, useCallback, useMemo } from "react";

interface FavoriteButtonProps {
    cardId: number;
    isActive: boolean;
    setActive: (id: number) => void;
    size?: number;
    strokeWidth?: number;
}

export const FavoriteButton = memo(({ cardId, isActive, setActive, size, strokeWidth }: FavoriteButtonProps) => {
    const icon = useMemo(() => <StarIcon />, []);

    const handleClick = useCallback(() => {
        setActive(cardId);
    }, [setActive, cardId]);

    return (
        <IconAction
            title="Favorite"
            isActive={isActive}
            onClick={handleClick}
            size={size}
            hoverColor="var(--blue-color-400)"
            strokeWidth={strokeWidth}
        >
            {icon}
        </IconAction>
    )
});

FavoriteButton.displayName = "FavoriteButton";
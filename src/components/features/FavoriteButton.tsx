import { StarIcon } from "@/icons/StarIcon";
import { IconAction } from "../UI/IconAction/IconAction";

interface FavoriteButtonProps {
    cardId: number;
    isActive: boolean;
    setActive: (id: number) => void;
    size?: number;
    strokeWidth?: number;
}

export const FavoriteButton = ({ cardId, isActive, setActive, size, strokeWidth }: FavoriteButtonProps) => (
    <IconAction
        title="Favorite"
        isActive={isActive}
        onClick={() => setActive(cardId)}
        size={size}
        hoverColor="var(--blue-color-400)"
        strokeWidth={strokeWidth}
    >
        <StarIcon />
    </IconAction>
);
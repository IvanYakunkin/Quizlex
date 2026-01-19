import { useState } from "react";

interface FavoriteButtonProps {
    cardId: number;
    isActive?: boolean;
    size?: number;
    color?: string;
    hoverColor?: string;
    backgroundColor?: string;
    thickness?: number;
    activeBackground?: string;
    setActive?: (id: number) => void;
}

const defaultProps: FavoriteButtonProps = {
    size: 20,
    color: "white",
    backgroundColor: "transparent",
    thickness: 4,
    activeBackground: "#ef8504",
    cardId: -1,
    setActive: () => { },
    isActive: false,
}

const FavoriteButton = (props: FavoriteButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { size, color, hoverColor, backgroundColor, thickness, activeBackground, cardId, setActive, isActive } = { ...defaultProps, ...props };

    const styles = {
        stroke: color,
        fill: backgroundColor,
        strokeWidth: thickness,
        cursor: "pointer",
    }

    if (hoverColor !== undefined && isHovered) {
        styles.stroke = hoverColor;
    }

    const activate = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (setActive !== undefined) {
            setActive(cardId);
        }
    }

    if (isActive) {
        styles.fill = activeBackground;
    }

    return (
        <div title="Favorite">
            <svg version="1.1" onClick={activate} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={isActive ? "card__favorite-icon active" : "card__favorite-icon"} width={size + "px"} height={size + "px"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 116.864"><g><polygon fillRule="evenodd" style={styles} clipRule="evenodd" points="61.44,0 78.351,41.326 122.88,44.638 88.803,73.491 99.412,116.864 61.44,93.371 23.468,116.864 34.078,73.491 0,44.638 44.529,41.326 61.44,0" /></g></svg>
        </div>
    )
}

export default FavoriteButton;
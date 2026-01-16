import { playSound } from "@/utils/audio/playSound";
import { useState } from "react";

interface AudioButtonProps {
    word: string | null;
    language: string;
    size?: number;
    hoverColor?: string;
    color?: string;
}

const defaultProps: AudioButtonProps = {
    word: "",
    language: "en-US",
    size: 20,
    hoverColor: "none",
    color: "white",
}

const AudioButton = (props: AudioButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const { word, language, size, hoverColor } = { ...defaultProps, ...props };

    let color = props.color || defaultProps.color;

    const iconClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (word) {
            playSound(word, language);
        }
    }

    if (isHovered) {
        if (!('ontouchstart' in window)) {
            color = hoverColor;
        }
    }

    const style = {
        width: size + "px",
        height: size + "px",
        fill: "none",
        cursor: "pointer",
    }

    return (
        <div title="Sound">
            <svg onClick={iconClick} style={style} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_15_174)">
                    <rect width={size + "px"} height={size + "px"} />
                    <path d="M3 16V8H6L11 4V20L6 16H3Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 9C13 9 15 9.5 15 12C15 14.5 13 15 13 15" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 7C15 7 18 7.83333 18 12C18 16.1667 15 17 15 17" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 5C17 5 21 6.16667 21 12C21 17.8333 17 19 17 19" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </svg>
        </div>
    )
}

export default AudioButton;
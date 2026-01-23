import React, { memo, useCallback, useState } from 'react';

interface IconActionProps {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    variant?: 'color' | 'background';
    size?: number;
    color?: string;
    hoverColor?: string;
    isActive?: boolean;
    activeColor?: string;
    title?: string;
    strokeWidth?: number;
}

const IconActionComponent = ({
    children,
    onClick,
    variant = 'color',
    size = 24,
    color = 'currentColor',
    hoverColor,
    isActive = false,
    activeColor = '#ef8504',
    title,
    strokeWidth = 2,
}: IconActionProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    };

    const makeHovered = useCallback(() => {
        setIsHovered(true);
    }, []);

    const cancelHover = useCallback(() => {
        setIsHovered(false);
    }, []);

    const containerStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 1.5 + 'px',
        height: size * 1.5 + 'px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: "1px solid transparent",
        backgroundColor: variant === 'background' && hoverColor && isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
        borderColor: variant === 'background' && hoverColor && isHovered ? hoverColor : 'transparent'
    };

    const svgStyle: React.CSSProperties = {
        width: size + 'px',
        height: size + 'px',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: isActive ? activeColor : 'none',
        stroke: isActive ? activeColor : (isHovered && hoverColor && variant === 'color' ? hoverColor : color),
        transition: 'stroke 0.2s ease, fill 0.2s ease'
    };

    return (
        <button
            title={title}
            style={containerStyle}
            onClick={handleClick}
            onMouseEnter={makeHovered}
            onMouseLeave={cancelHover}
        >
            <svg viewBox="0 0 24 24" style={svgStyle} xmlns="http://www.w3.org/2000/svg">
                {children}
            </svg>
        </button>
    );
};

export const IconAction = memo(IconActionComponent)
IconAction.displayName = "IconAction";
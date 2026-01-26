import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    href?: string;
    children: React.ReactNode;
    background?: "success" | "primary" | "error" | "empty";
    hoverBackground?: string;
    color?: string;
    size?: "sm" | "md" | "lg" | "full" | "h-full";
    width?: string;
    isBold?: boolean;
    fontSize?: string;
}

export const Button = ({
    onClick,
    href,
    children,
    background = "success",
    hoverBackground,
    color,
    width,
    isBold = false,
    size = "md",
    fontSize,
}: ButtonProps) => {

    const combinedClasses = [
        styles.btn,
        styles[background],
        styles[size],
        styles.button
    ].join(" ");

    const inlineStyles: React.CSSProperties = {
        color,
        fontWeight: isBold ? "bold" : "normal",
        fontSize,
        width,
        ['--hover-bg' as string]: hoverBackground
    };

    if (href) {
        return (
            <Link href={href} className={combinedClasses} style={inlineStyles}>
                {children}
            </Link>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick();
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <button className={combinedClasses} style={inlineStyles} onMouseDown={handleMouseDown} onClick={handleClick}>
            {children}
        </button>
    );
};
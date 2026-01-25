import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    onMouseDown?: () => void;
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
    onMouseDown,
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
        if (onMouseDown) {
            onMouseDown();
        } else if (onClick) {
            onClick();
        }
    }

    return (
        <button className={combinedClasses} style={inlineStyles} onMouseDown={handleClick} onClick={handleClick}>
            {children}
        </button>
    );
};
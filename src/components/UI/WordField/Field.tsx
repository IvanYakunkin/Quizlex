import React, { InputHTMLAttributes, memo, Ref } from "react";
import styles from "./WordField.module.css";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    correct?: boolean | string;
    ref?: Ref<HTMLInputElement>;
}

export const Field = memo(({
    correct,
    className,
    ref,
    ...props
}: FieldProps) => {
    const fieldClassName = [
        styles.field,
        !!correct ? styles.correct : "",
        "card__field",
        className
    ].filter(Boolean).join(" ");

    return (
        <input
            type="text"
            ref={ref}
            className={fieldClassName}
            {...props}
        />
    );
});

Field.displayName = "Field";

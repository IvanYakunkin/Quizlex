import React, { ForwardedRef, forwardRef, InputHTMLAttributes, memo } from "react";
import styles from "./WordField.module.css";

interface FieldInterface extends InputHTMLAttributes<HTMLInputElement>{
    correct?: boolean | string;
}

const Field = memo(forwardRef((props: FieldInterface, ref?: ForwardedRef<HTMLInputElement>) => {
    const {correct, ...restProps} = props;

    const fieldClassName = (!!correct ? styles.field + " " + styles.correct : styles.field) + " card__field";

    return (
         <input type="text" ref={ref} className={fieldClassName} {...restProps} />
    );
}));

export default Field;


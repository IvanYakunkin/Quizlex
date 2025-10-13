import { memo, useCallback, useState } from "react";
import Field from "./Field";
import Letters from "./Letters";

interface FieldWithLettersProps{
    onChange: (value: string, id?: number) => void;
    cardId?: number;
    placeholder?: string;
    language: string;
    value: string;
    ref: React.RefObject<HTMLInputElement | null>;
    isAlwaysShown?: boolean;
}

const FieldWithLetters = (props: FieldWithLettersProps) => {

    const [isAnimation, setIsAnimation] = useState(false);

    const addLetter = useCallback((value: string) => {

        if (props.ref && 'current' in props.ref && props.ref.current) {
            if(props.ref.current.value === ""){
                props.onChange(value);
            }

            const cursorPosition = props.ref.current.selectionStart;

            if(cursorPosition){
                const leftPart = props.value.slice(0, cursorPosition);
                const rightPart = props.value.slice(cursorPosition, props.value.length);
                const newValue = leftPart + value + rightPart;
                props.onChange(newValue);

                // Set cursor in the correct position
                setTimeout(() => {
                    if(props.ref && props.ref.current){
                        props.ref.current.selectionStart = cursorPosition+1;
                        props.ref.current.selectionEnd = cursorPosition+1;
                    }
                }, 0);
            }
        }
    }, [props]);

    const updateField = (value: string, id?:number) => {
        props.onChange(value, id);
    }
    
    return (
        <>  
            <Field
                ref={props.ref}
                onFocus={() => setIsAnimation(true)}
                onBlur={() => setIsAnimation(false)} 
                placeholder={props.placeholder} 
                onChange={(e) => updateField(e.target.value, props.cardId)} 
                value={props.value}
            />
        
            <Letters isAnimation={isAnimation} language={props.language} updateValue={addLetter} isAlwaysShown={props.isAlwaysShown}/>
        </>
    )
};

export default memo(FieldWithLetters);



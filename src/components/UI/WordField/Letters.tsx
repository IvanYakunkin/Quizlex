import { memo, useEffect, useRef, useState } from "react";
import styles from "./WordField.module.css";

interface LettersProps{
    isAnimation?: boolean;
    language: string;
    updateValue: (replaceTo: string) => void;
    isAlwaysShown?: boolean;
}

type LettersArray = {
    [key: string]: string[];
};

const lettersDictionary: LettersArray = {
    german: ["ä","ö","ü","ß"],
    french: ["é", "è", "à", "ù", "ê", "â", "ô", "î", "û", "ë", "ï", "ü", "ç", "œ"],
    spanish: ["¡", "¿", "°", "á", "é", "í", "ñ", "ó", "ú", "ü"],
    russian: ["а", "б", "в", "г", "д", "е", "ё","ж", "з", "и", "й", "к", "л", "м","н", "о", "п", "р", "с", "т", "у","ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"],
}

const Letters = (props: LettersProps) => {

    const [letters, setLetters] = useState<string[]>([]);
    const [isUpperCase, setIsUpperCase] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        for(const language in lettersDictionary){
            if(props.language === language){
                setLetters(lettersDictionary[language]);
            }
        }
        
    }, [props.language]);

    const putLetter = (letter: string) => {
        props.updateValue(isUpperCase ? letter.toUpperCase() : letter.toLowerCase());
    }

    useEffect(() => {
        setTimeout(() => {
            if(containerRef.current){
            if(props.isAnimation){
                
                const scrollHeight = containerRef.current.scrollHeight;

                requestAnimationFrame(() => {
                    if(containerRef.current) containerRef.current.style.height = `${scrollHeight}px`;
                });   
            }else{
                if(containerRef.current) containerRef.current.style.height = '0';
            }
        }
        });
    }, [props.isAnimation]);
    
    return (
        <div className={`${styles.container} desktop`} ref={containerRef}>
            {letters.length > 0 && (
                <div className={styles.letters} onMouseDown={(e) => e.preventDefault()}>
                    {letters.map((l, key) => (
                        <div className={styles.letterOne} onClick={() => putLetter(l)} key={key}>{isUpperCase ? l.toUpperCase() : l.toLowerCase()}</div>
                    ))}

                    <div className={styles.letterOne} onClick={() => setIsUpperCase(!isUpperCase)}>^</div>
                </div>
            )}
        </div>
    );
};


export default memo(Letters);
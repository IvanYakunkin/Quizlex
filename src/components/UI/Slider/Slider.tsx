import { Languages, Card } from "@/types/types";
import { useState, useEffect, useImperativeHandle, useCallback } from "react";
import ReactCardFlip from 'react-card-flip'; 
import AudioButton from "../AudioButton/AudioButton";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { setFavoriteDB, setFavoriteLS } from "@/utils/common";
import styles from "./Slider.module.css";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface SliderRef{
    refreshCards?: () => void;
    switchDefaultSides?: () => void;
    toPrevious?: () => void;
    toNext?: () => void;
}

interface SliderProps {
    cards: Card[],
    languages: Languages,
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    currentCardId: number;
    setCurrentCardId: React.Dispatch<React.SetStateAction<number>>;
    isNavigationHidden?: boolean;
    isMaxHeight?: boolean;
    sliderRef: React.RefObject<SliderRef | null>;
}

// Collection of classes for animation
const slideAnimationTypes: string[] = ["slideRightAnimation", "slideLeftAnimation"];
const horizontalAnimationDuration = 100;

const Slider = (props: SliderProps) => {
    const { status, data: session} = useSession();
    const { id } = useParams();
    const [isFrontDefault, setIsFrontDefault] = useState(true);
    const [isTranslationShown, setIsTranslationShown] = useState(false);
    // Needed to show rotate-animation
    const [isFlipped, setIsFlipped] = useState(false);
    // Contains css-class for animation
    const [slideAnimate, setSlideAnimate] = useState("");

    const currentCard = props.cards[props.currentCardId];

    const toNextWord = useCallback(() => {
        if(props.currentCardId + 1 < props.cards.length){
            if(isFrontDefault){
                setIsTranslationShown(false)
            }else{
                setIsTranslationShown(true);
            } 

            setAnimation(slideAnimationTypes[0]);
            props.setCurrentCardId(props.currentCardId + 1);
        }  
    }, [props, isFrontDefault]);

    const toPreviousWord = useCallback(() => {
        if(props.currentCardId > 0){
            if(isFrontDefault){
                setIsTranslationShown(false)
            }else{
                setIsTranslationShown(true);
            }

            setAnimation(slideAnimationTypes[1]);
            props.setCurrentCardId(props.currentCardId - 1);
        }
    }, [props, isFrontDefault]);

    const toPreviousWordClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        toPreviousWord();
    }

    const toNextWordClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        toNextWord();
    }
    
    const setAnimation = (type:string) => {
        setSlideAnimate(type);

        setTimeout(() => {
            setSlideAnimate("");
        }, horizontalAnimationDuration);
    }

    const flipCart = useCallback(() => {
        setIsFlipped(!isFlipped);        
        setIsTranslationShown(!isTranslationShown); 
    }, [isFlipped, isTranslationShown]);

    const refreshCards = () => {
        props.setCurrentCardId(0);
    }

    const switchDefaultSides = () => {
        setIsFlipped(!isFlipped);
        setIsFrontDefault(!isFrontDefault)
        setIsTranslationShown(!isTranslationShown);
    }

    // Define which word should be shown for each side
    let frontSideLabel, backSideLabel;

    if((isFlipped && isTranslationShown) || (!isFlipped && !isTranslationShown)){  
        [frontSideLabel, backSideLabel] = [currentCard.term, currentCard.definition];
    }else{
        [frontSideLabel, backSideLabel] = [currentCard.definition, currentCard.term];
    }

    useImperativeHandle(props.sliderRef, () => ({
        refreshCards: refreshCards,
        switchDefaultSides: switchDefaultSides,
        toPrevious: toPreviousWord,
        toNext: toNextWord,
    }));

    const clickFavorite = (wordId: number) => {
        if(props.setCards){
            if(status === "authenticated" && id){
                if(session.user?.email){
                    setFavoriteDB(props.setCards, wordId, +id, session.user?.email);
                }
            }else{
                setFavoriteLS(props.setCards, wordId);
            }
        }
    }

    let startX: number | null = null;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!startX) return;

        const xDiff = e.touches[0].clientX - startX;

        if (xDiff > 50) {
            startX = null; 
            toPreviousWord();
        }else if(xDiff < -50){
            startX = null;
            toNextWord();
        }
    }

    // Keyboard
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight" && !props.isNavigationHidden) {
                toNextWord();
            }
            if(event.key === "ArrowLeft" && !props.isNavigationHidden) {
                toPreviousWord();
            }
            if(event.code === "Space"){
                event.preventDefault();
                flipCart();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
        
    }, [props.currentCardId, flipCart, toNextWord, toPreviousWord, props.isNavigationHidden]);

    const moduleSliderClass = props.isMaxHeight ? `${styles.slider} ${styles.maxHeight}` : styles.slider;
    const modulesSliderAnimationClass = slideAnimate === "slideRightAnimation" ? styles.slideRightAnimation : styles.slideLeftAnimation;

    return (
        <ReactCardFlip flipDirection="vertical" isFlipped={isFlipped} infinite={true} flipSpeedBackToFront={0.3} flipSpeedFrontToBack={0.3}>
            <div className={slideAnimate ? moduleSliderClass + " " + modulesSliderAnimationClass : moduleSliderClass} onClick={flipCart} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>            
                        <FavoriteButton 
                            size={25} 
                            hoverColor="var(--blue-color-400)" 
                            isActive={props.cards[props.currentCardId].isFavorite} 
                            wordId={props.cards[props.currentCardId].id} 
                            setActive={clickFavorite}
                        />
                    </div> 
                    
                    <div className={styles.counter}>{(props.currentCardId + 1) + " / " + props.cards.length}</div>

                    <div className={styles.headerRight}>
                        <AudioButton   
                            word={isTranslationShown ? currentCard.definition : currentCard.term} 
                            language={isTranslationShown ? props.languages.definition : props.languages.term}
                            size={25}
                            hoverColor="var(--blue-color-400)"
                        />   
                    </div>
                </div>

                <div className={styles.content}>{frontSideLabel}</div>
                {!props.isNavigationHidden &&
                <div className={styles.footer}>
                    <div className={styles.nav} onClick={toPreviousWordClick}>
                        <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                            <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  "/>
                        </svg>
                    </div>
                    <div className={`${styles.nav} ${styles.rotated}`} onClick={toNextWordClick}>
                        <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                            <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  "/>
                        </svg>
                    </div>
                </div>
                }
                
            </div>

            <div className={slideAnimate ? moduleSliderClass + " " + modulesSliderAnimationClass : moduleSliderClass} onClick={flipCart} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>  
                <div className={styles.header}>
                    <div className={styles.headerLeft}>            
                        <FavoriteButton 
                            size={25} 
                            hoverColor="var(--blue-color-400)" 
                            isActive={props.cards[props.currentCardId].isFavorite} 
                            wordId={props.cards[props.currentCardId].id} 
                            setActive={clickFavorite}
                        />
                    </div> 
                    
                    <div className={styles.counter}>{(props.currentCardId + 1) + " / " + props.cards.length}</div>

                    <div className={styles.headerRight}>
                        <AudioButton   
                            word={isTranslationShown ? currentCard.definition : currentCard.term} 
                            language={isTranslationShown ? props.languages.definition : props.languages.term}
                            size={25}
                            hoverColor="var(--blue-color-400)"
                        />   
                    </div>
                </div>

                <div className={styles.content}>{backSideLabel}</div>
                
                {!props.isNavigationHidden &&
                <div className={styles.footer}>
                    <div className={styles.nav} onClick={toPreviousWordClick}>
                        <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                            <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  "/>
                        </svg>
                    </div>
                    <div className={`${styles.nav} ${styles.rotated}`} onClick={toNextWordClick}>
                        <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                            <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  "/>
                        </svg>
                    </div>
                </div>
                }
            </div>
        </ReactCardFlip>
    )
};

export default Slider;
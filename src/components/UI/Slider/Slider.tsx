import { useState, useEffect, useImperativeHandle, useCallback, memo } from "react";
import styles from "./Slider.module.css";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { setFavoriteLS } from "@/utils/favorites/favoritesLS";
import { changeFavoriteState } from "@/utils/favorites/changeFavoriteState";
import { BaseCard } from "@/types/module";
import { CardFlipper } from "../CardFlipper/CardFlipper";
import { toggleFavoriteAction } from "@/services/favoriteActions";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { SoundButton } from "@/components/features/SoundButton";
import { Languages } from "@/types/types";

export interface SliderRef {
    refreshCards?: () => void;
    switchDefaultSides?: () => void;
    toPrevious?: () => void;
    toNext?: () => void;
}

interface SliderProps {
    cards: BaseCard[],
    languages: Languages,
    changeCards: (newCards: BaseCard[]) => void,
    currentCardId: number;
    setCurrentCardId: React.Dispatch<React.SetStateAction<number>>;
    isFavoriteHidden?: boolean;
    isNavigationHidden?: boolean;
    isMaxHeight?: boolean;
    sliderRef: React.RefObject<SliderRef | null>;
}

// Collection of classes for animation
const slideAnimationTypes: string[] = ["slideRightAnimation", "slideLeftAnimation"];
const horizontalAnimationDuration = 200;

export const Slider = memo((props: SliderProps) => {
    const { status } = useSession();
    const { id } = useParams();
    const [isFrontDefault, setIsFrontDefault] = useState(true);
    const [isTranslationShown, setIsTranslationShown] = useState(false);
    // Needed to show rotate-animation
    const [isFlipped, setIsFlipped] = useState(false);
    // Contains css-class for animation
    const [slideAnimate, setSlideAnimate] = useState("");
    const [touchStartX, setTouchStartX] = useState(0);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const currentCard = props.cards[props.currentCardId];

    const setAnimation = (type: string) => {
        setSlideAnimate(type);

        setTimeout(() => {
            setSlideAnimate("");
        }, horizontalAnimationDuration);
    }

    const toNextWord = useCallback(() => {
        if (props.currentCardId + 1 < props.cards.length) {
            if (isFrontDefault) {
                setIsTranslationShown(false)
            } else {
                setIsTranslationShown(true);
            }

            setAnimation(slideAnimationTypes[0]);
            props.setCurrentCardId(props.currentCardId + 1);
        }
    }, [props, isFrontDefault]);

    const toPreviousWord = useCallback(() => {
        if (props.currentCardId > 0) {
            if (isFrontDefault) {
                setIsTranslationShown(false)
            } else {
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

    if ((isFlipped && isTranslationShown) || (!isFlipped && !isTranslationShown)) {
        [frontSideLabel, backSideLabel] = [currentCard.term, currentCard.definition];
    } else {
        [frontSideLabel, backSideLabel] = [currentCard.definition, currentCard.term];
    }

    useImperativeHandle(props.sliderRef, () => ({
        refreshCards: refreshCards,
        switchDefaultSides: switchDefaultSides,
        toPrevious: toPreviousWord,
        toNext: toNextWord,
    }));

    const clickFavorite = async (cardId: number) => {
        if (status === "authenticated" && id) {
            if (isFavoriteLoading) return;

            setIsFavoriteLoading(true);
            props.changeCards(changeFavoriteState(props.cards, cardId));

            const result = await toggleFavoriteAction(cardId, +id);
            if (result.error || result.success === false) {
                props.changeCards(changeFavoriteState(props.cards, cardId));
                console.error(result.error);
            }
            setIsFavoriteLoading(false);
        } else {
            setFavoriteLS(cardId);
            props.changeCards(changeFavoriteState(props.cards, cardId));
        }
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!touchStartX) return;

        const xDiff = e.touches[0].clientX - touchStartX;

        if (xDiff > 50) {
            setTouchStartX(0);
            toPreviousWord();
        } else if (xDiff < -50) {
            setTouchStartX(0);
            toNextWord();
        }
    }

    // Keyboard
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight" && !props.isNavigationHidden) {
                toNextWord();
            }
            if (event.key === "ArrowLeft" && !props.isNavigationHidden) {
                toPreviousWord();
            }
            if (event.code === "Space") {
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
    let firstSlideAnimationCls = "";
    let secondSlideAnimationCls = "";

    if (slideAnimate === "slideRightAnimation") {
        if (isFlipped) {
            firstSlideAnimationCls = "";
            secondSlideAnimationCls = styles.slideRightAnimation;
        } else {
            firstSlideAnimationCls = styles.slideRightAnimation;
            secondSlideAnimationCls = "";
        }
    } else if (slideAnimate === "slideLeftAnimation") {
        if (isFlipped) {
            firstSlideAnimationCls = "";
            secondSlideAnimationCls = styles.slideLeftAnimation;
        } else {
            firstSlideAnimationCls = styles.slideLeftAnimation;
            secondSlideAnimationCls = "";
        }
    } else {
        firstSlideAnimationCls = "";
        secondSlideAnimationCls = "";
    }

    return (
        <CardFlipper flipDirection="vertical" isFlipped={isFlipped} infinite={true} flipSpeedBackToFront={0.3} flipSpeedFrontToBack={0.3}>
            <div className={slideAnimate ? moduleSliderClass + " " + firstSlideAnimationCls : moduleSliderClass} onClick={flipCart} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        {!props.isFavoriteHidden &&
                            <FavoriteButton
                                isActive={props.cards[props.currentCardId].isFavorite}
                                cardId={props.cards[props.currentCardId].id}
                                setActive={clickFavorite}
                                size={28}
                                strokeWidth={1}
                            />
                        }
                    </div>

                    <div className={styles.counter}>{(props.currentCardId + 1) + " / " + props.cards.length}</div>

                    <div className={styles.headerRight}>
                        <SoundButton
                            word={isTranslationShown ? currentCard.definition : currentCard.term}
                            language={isTranslationShown ? props.languages.definition.code : props.languages.term.code}
                            size={28}
                            strokeWidth={1}
                        />
                    </div>
                </div>

                <div className={styles.content}>{frontSideLabel}</div>
                {!props.isNavigationHidden &&
                    <div className={styles.footer}>
                        <button className={styles.nav} onClick={toPreviousWordClick}>
                            <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                                <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  " />
                            </svg>
                        </button>
                        <button className={`${styles.nav} ${styles.rotated}`} onClick={toNextWordClick}>
                            <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                                <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  " />
                            </svg>
                        </button>
                    </div>
                }

            </div>

            <div className={slideAnimate ? moduleSliderClass + " " + secondSlideAnimationCls : moduleSliderClass} onClick={flipCart} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <FavoriteButton
                            isActive={props.cards[props.currentCardId].isFavorite}
                            cardId={props.cards[props.currentCardId].id}
                            setActive={clickFavorite}
                            size={28}
                            strokeWidth={1}
                        />
                    </div>

                    <div className={styles.counter}>{(props.currentCardId + 1) + " / " + props.cards.length}</div>

                    <div className={styles.headerRight}>
                        <SoundButton
                            word={isTranslationShown ? currentCard.definition : currentCard.term}
                            language={isTranslationShown ? props.languages.definition.code : props.languages.term.code}
                            size={28}
                            strokeWidth={1}
                        />
                    </div>
                </div>

                <div className={styles.content}>{backSideLabel}</div>

                {!props.isNavigationHidden &&
                    <div className={styles.footer}>
                        <button className={styles.nav} onClick={toPreviousWordClick}>
                            <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                                <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  " />
                            </svg>
                        </button>
                        <button className={`${styles.nav} ${styles.rotated}`} onClick={toNextWordClick}>
                            <svg fill="#000000" height="80px" width="80px" version="1.1" id="Layer_1" viewBox="0 0 476.213 476.213">
                                <polygon points="57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107  " />
                            </svg>
                        </button>
                    </div>
                }
            </div>
        </CardFlipper>
    )
});

Slider.displayName = "Slider";
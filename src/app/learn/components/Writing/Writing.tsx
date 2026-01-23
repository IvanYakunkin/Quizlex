import { ResultPage } from "../ResultPage";
import { WritingMistakePage } from "./WritingMistakePage";
import { WritingTemplate } from "./WritingTemplate";
import { Languages } from "@/types/types";
import { useWritingLogic } from "@/hooks/useWritingLogic";
import { BaseCard } from "@/types/module";

interface WritingProps {
    cards: BaseCard[];
    changeLanguage: boolean;
    languages: Languages;
}

export const Writing = (props: WritingProps) => {
    const { state, actions } = useWritingLogic({
        cards: props.cards,
        changeLanguage: props.changeLanguage
    });

    const {
        writingStatus,
        currentCard,
        inputValue,
        progressLabel,
        answeredCards,
        isMounted
    } = state;

    if (!isMounted) {
        return (
            <div className="writing-container" style={{ minHeight: '400px', opacity: 0 }}>

            </div>
        );
    }

    if (!currentCard) return null;

    return (
        <div className="writing-container">
            {(writingStatus === "correct" || writingStatus === "") &&
                <WritingTemplate
                    inputValue={inputValue}
                    onChange={actions.setInputValue}
                    termToShow={props.changeLanguage ? currentCard.definition : currentCard.term}
                    checkAnswer={actions.checkAnswer}
                    writingStatus={writingStatus}
                    progressLabel={progressLabel}
                />
            }

            {(writingStatus === "finished" || writingStatus === "result") &&
                <ResultPage
                    cards={answeredCards}
                    changeCards={actions.setAnsweredCards}
                    closeResultPage={actions.resetRound}
                    title={writingStatus === "finished" ? "Congratulations! You have completed the module!" : ""}
                    isGameOver={writingStatus === "finished"}
                    language={props.languages.term}
                />
            }

            {(writingStatus === "empty" || writingStatus === "mistake") &&
                <WritingMistakePage
                    currentCard={currentCard}
                    enteredAnswer={inputValue}
                    changeLanguage={props.changeLanguage}
                    toNextWord={actions.toNextWord}
                />
            }
        </div>
    );
};
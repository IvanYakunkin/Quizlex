import { ResultPage } from "../ResultPage";
import { WritingMistakePage } from "./WritingMistakePage";
import { WritingTemplate } from "./WritingTemplate";
import { Languages, StudySettings } from "@/types/types";
import { useWritingLogic } from "@/hooks/useWritingLogic";
import { BaseCard } from "@/types/module";

interface WritingProps {
    cards: BaseCard[];
    languages: Languages;
    settings: StudySettings;
}

export const Writing = (props: WritingProps) => {
    const { state, actions } = useWritingLogic({
        cards: props.cards,
        settings: props.settings,
        languages: props.languages
    });

    const isFrontLanguageChanged = props.settings.frontLanguage.id !== props.languages.term.id;

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

    return (
        <div className="writing-container">
            {(writingStatus === "correct" || writingStatus === "") &&
                <WritingTemplate
                    inputValue={inputValue}
                    onChange={actions.setInputValue}
                    termToShow={isFrontLanguageChanged ? currentCard.definition : currentCard.term}
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
                    language={props.languages.term.code}
                />
            }

            {(writingStatus === "empty" || writingStatus === "mistake") &&
                <WritingMistakePage
                    currentCard={currentCard}
                    enteredAnswer={inputValue}
                    changeLanguage={isFrontLanguageChanged}
                    toNextWord={actions.toNextWord}
                />
            }
        </div>
    );
};
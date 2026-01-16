// Check answer of wirting-exercise
export function checkWriting(enteredWord:string, translation:string): boolean{
    enteredWord = enteredWord.toLowerCase().trim();
    translation = translation.toLowerCase().trim();

    const enteredWordSeparator = enteredWord.includes(';') ? ';' : ",";
    const translationSeparator = translation.includes(';') ? ';' : ",";
    let isCorrect = false;

    const splittedTranslation = translation.split(enteredWordSeparator);
    const splittedEnteredWord = enteredWord.split(translationSeparator);

    // Check multiple words and multiple translations
    for(let w_id = 0; w_id < splittedEnteredWord.length; w_id++){
        isCorrect = false;

        for(let t_id = 0; t_id < splittedTranslation.length; t_id++){
            if(splittedEnteredWord[w_id].trim() === splittedTranslation[t_id].trim()){
                isCorrect = true;
                break;
            }
        }

        if(!isCorrect) break;
    }
    
    return isCorrect;
}
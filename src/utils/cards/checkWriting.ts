export function checkWriting(enteredWord: string, translation: string): boolean {
    const normalize = (str: string): string[] => {
        return str
            .toLowerCase()
            .split(/[;,]/)
            .map(word => word.trim())
            .filter(word => word.length > 0);
    };

    const userWords = normalize(enteredWord);
    const correctWords = normalize(translation);

    if (userWords.length === 0 && correctWords.length > 0) return false;
    if (userWords.length === 0 && correctWords.length === 0) return true;

    return userWords.every(uWord =>
        correctWords.includes(uWord)
    );
}
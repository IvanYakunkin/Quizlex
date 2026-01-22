export function playSound(word: string, language: string) {
    const synthesis = new SpeechSynthesisUtterance(word);
    synthesis.lang = language;
    speechSynthesis.speak(synthesis);
}
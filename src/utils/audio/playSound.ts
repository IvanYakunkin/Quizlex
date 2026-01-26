export function playSound(word: string, language: string) {
    window.speechSynthesis.cancel();
    const synthesis = new SpeechSynthesisUtterance(word);
    synthesis.lang = language;
    speechSynthesis.speak(synthesis);
}
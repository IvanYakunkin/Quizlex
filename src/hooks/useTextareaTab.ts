export const useTextareaTab = (
    setTextareaContent: React.Dispatch<React.SetStateAction<string>>
) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            const newValue = value.substring(0, start) + "\t" + value.substring(end);

            setTextareaContent(newValue);

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
    };

    return handleKeyDown;
};
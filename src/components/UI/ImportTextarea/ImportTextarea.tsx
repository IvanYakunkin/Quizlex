import React, { useState, useMemo, useEffect } from 'react';
import styles from "./ImportTextarea.module.css";
import { useTextareaTab } from '@/hooks/useTextareaTab';
import { parseTextToCards } from '@/utils/parsers';
import { CreateCardInput } from '@/types/module';

interface TextareaProps {
  separator: string,
  changeCards: (newCards: CreateCardInput[]) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
}

const placeholderLinesNumber: number = 3;

export const ImportTextarea: React.FC<TextareaProps> = ({ separator, changeCards, textareaRef }) => {

  const [textareaContent, setTextareaContent] = useState("");

  const handleKeyDown = useTextareaTab(setTextareaContent);

  const textareaChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(event.target.value);
  }

  useEffect(() => {
    const previewTerms = parseTextToCards(textareaContent, separator);
    changeCards(previewTerms);
  }, [textareaContent, separator, changeCards]);

  const separatorPlaceholder = useMemo(() => {
    if (textareaContent) return "";

    let sPlaceholders = "";
    for (let i = 0; i < placeholderLinesNumber; i++) {
      sPlaceholders += `Word ${i + 1} ${separator} Definition ${i + 1}\n`;
    }
    return sPlaceholders;
  }, [separator, textareaContent]);

  return (
    <textarea
      className={styles.import__textarea}
      ref={textareaRef}
      value={textareaContent}
      onChange={textareaChanged}
      onKeyDown={handleKeyDown}
      placeholder={separatorPlaceholder}>
    </textarea>
  );
};

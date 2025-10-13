import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/types/types";
import styles from "./ImportTextarea.module.css";

interface TextareaProps {
  separator: string,
  setPreview: React.Dispatch<React.SetStateAction<Card[]>>,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
}

const placeholderLinesNumber:number = 3;

const ImportTextarea: React.FC<TextareaProps> = ({separator, setPreview, textareaRef}) => {
  
  const [separatorPlaceholder, setSeparatorPlaceholder] = useState("");
  const [textareaContent, setTextareaContent] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
    
      setTextareaContent(newValue);

      const newCursorPos = start + 1;
      textarea.value = newValue;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }
  };

  const textareaChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(event.target.value);
  }

  const generatePlaceholder = useCallback(() => {
    let sPlaceholders = "";
    for(let i = 0; i < placeholderLinesNumber; i++){
      sPlaceholders += "Word " + (i+1) + separator + "Definition " + (i+1) + "\n";
    }
    
    setSeparatorPlaceholder(sPlaceholders);
  }, [separator]);

  const generatePreview = useCallback(() => {
    const previewTerms = textareaContent.split("\n")
      .map(pair => pair.split(separator).map(el => el.trim()))
      .filter(([term, definition]) => term || definition)
      .map(([term="", definition=""], key) => ({id: key, term, definition, isFavorite: false}));
    
    setPreview(previewTerms);
  }, [textareaContent, separator, setPreview]);

  useEffect(() => {
      generatePreview();
      if(!textareaContent){
        generatePlaceholder();
      }

  }, [textareaContent, generatePreview, generatePlaceholder]);

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

export default ImportTextarea;
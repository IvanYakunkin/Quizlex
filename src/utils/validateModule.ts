import { Dispatch, RefObject, SetStateAction } from "react";

interface validateFieldsParams{
    nameInputRef: RefObject<HTMLInputElement | null>;
    setNameInputError: Dispatch<SetStateAction<boolean>>;
    descriptionInputRef: RefObject<HTMLInputElement | null>;
    setDescriptionInputError: Dispatch<SetStateAction<boolean>>;
    cardsLength: number;
    textareaRef?: RefObject<HTMLTextAreaElement | null>;
}

export const validateFields = (params: validateFieldsParams) => {
    if(params.nameInputRef.current && params.descriptionInputRef.current){
        if(params.nameInputRef.current.value.trim() === ""){
            params.setNameInputError(true); 
            params.nameInputRef.current.focus();
            return false;
        }else{
            params.setNameInputError(false);
        }
        if(params.descriptionInputRef.current.value.trim() === ""){
            params.setDescriptionInputError(true);
            params.descriptionInputRef.current.focus();

            return false;
        }else{
            params.setDescriptionInputError(false);
        }

        if(params.cardsLength < 1){
            if(params.textareaRef && params.textareaRef.current){
                params.textareaRef.current.focus();
            }

            return false;
        }

        return true;
    }

    return false;
}

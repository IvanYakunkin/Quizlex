import { Card } from "@/types/types";

interface UpdateModuleParams {
    id: number;
    name: string;
    description: string;
    termLanguageId: number;
    definitionLanguageId: number;
    cards: Card[];
}

export const updateModuleDB = async (params: UpdateModuleParams) => {
    try {
        const moduleData = {
            name: params.name,
            description: params.description,
            termLanguageId: params.termLanguageId,
            definitionLanguageId: params.definitionLanguageId,
        }
        const moduleResponse = await fetch(`/api/modules/${params.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
            },

            body: JSON.stringify({ module: moduleData, cards: params.cards }),
        });

        if (!moduleResponse.ok) {
            throw new Error("Error updating module");
        }

        return await moduleResponse.json();

    } catch (error) {
        console.error(error);
        alert("Error updating module");
    }
}
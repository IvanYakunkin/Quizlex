// Client queries

import { Card } from "@/types/types";

export const updateCard = async (id: number, newCard: Card) => {
    const response = await fetch(`/api/modules/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({ card: newCard }),
    });

    if (!response.ok) {
        throw new Error("Error updating word");
    }

    return response.json();
}
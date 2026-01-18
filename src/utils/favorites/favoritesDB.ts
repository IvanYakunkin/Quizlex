export async function setFavoriteDB(cardId: number, moduleId: number) {
    const favoriteResponse = await fetch(`/api/cards/${cardId}/favorite/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId }),
    });

    if (!favoriteResponse.ok) {
        throw new Error("Failed to change card info");
    }
}
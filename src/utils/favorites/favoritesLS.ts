import { AppModule } from "@/types/module";

export function setFavoriteLS(cardId: number) {
    const localModule = localStorage.getItem("module");

    if (localModule) {
        const appModule: AppModule = JSON.parse(localModule);
        appModule.cards[cardId].isFavorite = !appModule.cards[cardId].isFavorite;
        localStorage.setItem("module", JSON.stringify(appModule));
    }
}
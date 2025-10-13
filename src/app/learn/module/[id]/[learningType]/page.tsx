// TODO: Add functionality for studying other people's modules

import { findModuleById } from "@/services/moduleService";
import { LearningType, WordsModule } from "@/types/types";
import LearningPage from "@/app/learn/components/LearningPage";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserIdByEmail } from "@/services/userService";
import { getFavoriteCards } from "@/services/favoriteService";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number, learningType: LearningType }>
}) {
    const moduleId = (await params).id;
    const learningType = (await params).learningType;

    const wordsModule: WordsModule | null = await findModuleById(moduleId);

    const session: Session | null = await getServerSession(authOptions);
    if(!session || !session.user?.email){
      // TODO: Store ID in session
      // ISSUE: There is no obvious way to store ID in session using next-auth
      return;
    }

    const userId = await findUserIdByEmail(session.user.email);

    if(!userId || !wordsModule){
      return;
    }

    const favoriteCardIds = await getFavoriteCards(userId, moduleId);

    // Check favorites
    wordsModule.cards = wordsModule.cards.map(card => ({
      ...card,
      isFavorite: favoriteCardIds.includes(card.id)
    }));
   
    return (
        <LearningPage learningType={learningType} module={wordsModule} />
    );
}
import { findModuleById } from "@/services/moduleService";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserIdByEmail } from "@/services/userService";
import { getFavoriteCards } from "@/services/favoriteService";
import { WordsModule } from "@/types/types";
import { notFound } from "next/navigation";
import { Module } from "../components/Module/Module";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {

  const { id } = await params;

  const wordsModule: WordsModule | null = await findModuleById(id);

  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    // TODO: Store ID in session
    // ISSUE: There is no obvious way to store ID in session using next-auth
    notFound();
  }

  const userId = await findUserIdByEmail(session.user.email);

  if (!userId || !wordsModule) {
    notFound();
  }

  const favoriteCardIds = await getFavoriteCards(userId, id);

  // Check favorites
  wordsModule.cards = wordsModule.cards.map(card => ({
    ...card,
    isFavorite: favoriteCardIds.includes(card.id)
  }));

  return (
    <Module moduleData={wordsModule} />
  );
}
import { authOptions } from "@/lib/auth";
import { toggleFavoriteCard } from "@/services/favoriteService";
import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ cardId: string }> }
) {
    try {
        const { cardId } = await params;
        const { moduleId } = await req.json();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const result = await toggleFavoriteCard(
            Number(session.user.id),
            Number(moduleId),
            Number(cardId)
        );

        return Response.json(result);
    } catch {
        return Response.json({ error: "Failed to toggle favorite" }, { status: 500 });
    }
}
import { authOptions } from "@/lib/auth";
import { deleteModule, findUserModuleById, updateModule, updateModuleWord } from "@/services/moduleService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }

        const wordsModule = await findUserModuleById(+session.user.id, +id);

        if (!wordsModule) {
            return NextResponse.json({ error: "Module not found" }, { status: 404 });
        }

        return NextResponse.json(wordsModule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }

        const deletedModule = await deleteModule(+id, +session.user.id);

        return NextResponse.json(deletedModule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession();

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }

        const data = await request.json();

        const updatedModule = await updateModule(+id, +session.user.id, data.module, data.cards);

        return NextResponse.json(updatedModule, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }

        const { card } = await request.json();

        if (!card) {
            return NextResponse.json({ error: 'Word is required' }, { status: 400 });
        }

        const updatedCard = await updateModuleWord(+id, +session.user.id, card);
        if (!updatedCard) {
            return NextResponse.json(
                { error: "Card not found or access denied" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedCard, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}




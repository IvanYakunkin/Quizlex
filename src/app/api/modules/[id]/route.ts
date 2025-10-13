import { deleteModule, findUserModuleById, updateModuleWord } from "@/services/moduleService";
import { findUserIdByEmail } from "@/services/userService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Use middlewares for authentication check

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession();

        if(!session || !session.user?.email){
            return NextResponse.json({error: "User is not authorized"}, {status: 401});
        }

        const userId = await findUserIdByEmail(session.user.email);

        if(!userId){
            return NextResponse.json({error: "User is not authorized"}, {status: 401});
        }

        const wordsModule = await findUserModuleById(userId, id);
       
        if(!wordsModule){
            return NextResponse.json({error: "Module not found"}, {status: 404});
        }

        return NextResponse.json(wordsModule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } 
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession();

        if(!session || !session.user?.email){
            return NextResponse.json({error: "User is not authorized"}, {status: 401});
        }

        const userId = await findUserIdByEmail(session.user.email);

        if(!userId){
            return NextResponse.json({error: "User is not authorized"}, {status: 401});
        }

        const foundModule = await findUserModuleById(userId, id);

        if (!foundModule) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const deletedModule = await deleteModule(id, userId);

        return NextResponse.json(deletedModule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } 
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession();

        if (!session || !session.user?.email) {
        return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }

        const userId = await findUserIdByEmail(session.user.email);

        if (!userId) {
        return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
        }
        
        const { card } = await request.json();

        if (!card) {
            return NextResponse.json({ error: 'Word is required' }, { status: 400 });
        }

        const foundModule = await findUserModuleById(userId, id);

        if (!foundModule) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const updatedModule = await updateModuleWord(id, userId, card);

        return NextResponse.json(updatedModule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } 
}




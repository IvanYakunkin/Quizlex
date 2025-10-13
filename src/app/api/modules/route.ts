import { createModule } from '@/services/moduleService';
import { findUserIdByEmail } from '@/services/userService';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { module, cards } = await req.json();

    if (!module || !cards) {
        return NextResponse.json({ error: "Module data not found!" }, { status: 404 });
    }

    const session = await getServerSession();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
    }

    const userId = await findUserIdByEmail(session.user.email);

    if (!userId) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const createdModule = await createModule(module, cards, userId);
    
    return NextResponse.json(createdModule, { status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
import { authOptions } from '@/lib/auth';
import { createModule } from '@/services/moduleService';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { module, cards } = await req.json();

    if (!module || !cards) {
      return NextResponse.json({ error: "Module data not found!" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "User is not authorized" }, { status: 401 });
    }

    const createdModule = await createModule(module, cards, +session.user.id);

    return NextResponse.json(createdModule, { status: 201 });

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
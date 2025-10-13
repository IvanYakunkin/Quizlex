import { PrismaClient } from '@/generated/prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

   if (!email) {
      return NextResponse.json({ error: 'Email is empty' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ id: user.id }, { status: 200 });
    
  } catch (error) {

      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

  } finally {
      await prisma.$disconnect();
  }
}
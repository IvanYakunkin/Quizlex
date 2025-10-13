import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(login: string, email: string, password: string) {
    const existingEmail = await prisma.user.findFirst({
      where: { email }
    });

    const existingLogin = await prisma.user.findFirst({
        where: { login }
    })

    if (existingEmail) {
       throw new Error('Email is already in use!');
    }

    if(existingLogin){
        throw new Error('Login is already in use!');
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        login,
      },
    });

    return newUser;
}

export async function findUserIdByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user ? user.id : null;
}

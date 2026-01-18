import { hash } from "bcrypt";
import { prisma } from "../../lib/prisma";

export async function createUser(login: string, email: string, authMethod?: string, password?: string) {
    const existingEmail = await prisma.user.findFirst({
        where: { email }
    });

    const existingLogin = await prisma.user.findFirst({
        where: { login }
    })

    if (existingEmail) {
        throw new Error('Email is already in use!');
    }

    if (existingLogin) {
        throw new Error('Login is already in use!');
    }

    const hashedPassword = password ? await hash(password, 10) : null;

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            login,
            authMethod
        },
    });

    return newUser;
}
import { hash } from "bcrypt";
import { prisma } from "../../lib/prisma";

interface CreateUserOptions {
    authMethod?: string;
    googleSub?: string;
}

export async function createUser(login: string, email: string, password: string | null, options?: CreateUserOptions) {
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

    const authMethod = options?.authMethod === undefined ? "credentials" : options.authMethod;

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            login,
            authMethod,
            google_sub: options?.googleSub
        },
    });

    return newUser;
}

export async function findUserByGoogleSub(sub: string) {
    return await prisma.user.findUnique({ where: { google_sub: sub } });
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
}

export async function updateSub(email: string, googleSub: string) {
    return await prisma.user.update({
        where: { email },
        data: { google_sub: googleSub }
    });
}
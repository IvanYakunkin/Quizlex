import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/"
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
                login: {}
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Missing credentials");
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user || !user.password) {
                        throw new Error("Invalid credentials");
                    }

                    const passwordCorrect = await compare(
                        credentials.password,
                        user.password
                    );

                    if (!passwordCorrect) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user.id.toString(),
                        login: user.login,
                        email: user.email,
                    };

                } catch (error) {
                    throw error;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.login = user.login;
                token.email = user.email;
            }
            if (account?.provider === "google" && !token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string }
                });
                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.login = dbUser.login;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.login = token.login as string;
            }

            return session;
        },
        // async signIn({ user, account }) {
        //     if (account?.provider === "google") {
        //         if (!user.email || !user.login) {
        //             return false;
        //         }

        //         const existingUser = await findUserIdByEmail(user.email);
        //         if (!existingUser) {
        //             await createUser(user.login, user.email, "google");
        //         }
        //     }
        //     return true;
        // }
    },
    secret: process.env.NEXTAUTH_SECRET
};

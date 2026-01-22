import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../lib/prisma";
import { createUser, findUserByEmail, findUserByGoogleSub, updateSub } from "@/services/userService";

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
            if (user && account?.provider === "credentials") {
                token.id = user.id;
                token.login = user.login;
                token.email = user.email;
            }
            else if (account?.provider === "google") {
                const dbUser = await findUserByGoogleSub(user.id);
                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.login = dbUser.login;
                    token.email = dbUser.email;
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
        async signIn({ user, account }) {
            try {
                if (account?.provider === "google") {
                    const googleSub = user.id;
                    if (!googleSub || !user.email) {
                        return false;
                    }

                    const existingUser = await findUserByGoogleSub(googleSub)

                    if (!existingUser) {
                        const userByEmail = await findUserByEmail(user.email);
                        if (userByEmail) {
                            // Merge accounts if receive the same email
                            await updateSub(user.email, googleSub);
                        } else {
                            const userLogin = user.email.split('@')[0] + "_" + Math.floor(Math.random() * 1000)
                            await createUser(userLogin, user.email, null, { authMethod: "google", googleSub });
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error("Auth error", error);
                return false;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};

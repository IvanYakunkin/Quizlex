import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import GoogleProvider from "next-auth/providers/google"
import { createUser, findUserIdByEmail } from '@/services/userService';
import { prisma } from '../../../../../lib/prisma';
import { User } from '@/generated/prisma/client';

const handler = NextAuth({
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
          const user: User | null = await prisma.user.findUnique({
            where: {
              email: credentials?.email
            }
          });

          if (!user?.password) {
            throw new Error("The password was not received");
          }

          if (!user) {
            throw new Error("No user found with this email");
          }

          const passwordCorrect = await compare(
            credentials?.password || '',
            user.password
          );

          if (!passwordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: user.id.toString(),
            login: user.login,
            email: user.email,
          };

        } catch (err) {
          console.log(err);
          throw new Error("Authorize: Authentication error");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session?.user) {
        session.user.email = token.email
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email || !user.name) {
          return false;
        }

        const existingUser = await findUserIdByEmail(user.email);
        if (!existingUser) {
          await createUser(user.name, user.email, "google");
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});


export { handler as GET, handler as POST, handler as authOptions };
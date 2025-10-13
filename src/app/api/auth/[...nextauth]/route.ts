import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient, User } from "@/generated/prisma/client";
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
      try{
        const user: User | null = await prisma.user.findUnique({
          where:{
            email: credentials?.email
          }
        });

        if(!user){
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
        
      }catch(err){
        console.log(err);
        throw new Error("Next Auth - Authorize: Authentication error");
      }   
    },
  })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        if(session && session.user){
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
});


export {handler as GET, handler as POST, handler as authOptions};
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { getServerSession, Session } from "next-auth";
import Providers from "./providers";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Quizlex | Flashcards",
  description: "Quizlex is a free app for learning foreign words using flashcards. With this app, you can import or create a module and memorize it.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session: Session | null = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
        <Header /> 
        {children}
        </Providers>
      </body>
    </html>
  );
}

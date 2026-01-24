import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { getServerSession, Session } from "next-auth";
import Providers from "./providers";
import { authOptions } from "@/lib/auth";
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: "Quizlex | Flashcards",
  description: "Quizlex is a free app for learning foreign words using flashcards. With this app, you can import or create a module and memorize it.",
};

const openSans = localFont({
  src: [
    {
      path: "../../public/fonts/OpenSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/OpenSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session: Session | null = await getServerSession(authOptions);

  return (
    <html lang="en" className={openSans.variable}>
      <body className={openSans.className}>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

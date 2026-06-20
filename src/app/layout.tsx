import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MentorUp — Plataforma Acadêmica com IA",
  description:
    "Mapas mentais, questões de PDF, flashcards, referências ABNT, ferramentas por área e consultoria acadêmica. Tudo para sua jornada universitária.",
  keywords: [
    "consultoria acadêmica",
    "IA para estudantes",
    "mapa mental",
    "TCC",
    "ABNT",
    "MentorUp",
  ],
  openGraph: {
    title: "MentorUp — Plataforma Acadêmica com IA",
    description: "Ferramentas de IA + consultoria acadêmica para estudantes universitários.",
    type: "website",
    locale: "pt_BR",
    siteName: "MentorUp",
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

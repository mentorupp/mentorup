import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

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
  title: "MentorUp — Consultoria Acadêmica de Excelência",
  description:
    "Consultoria acadêmica completa: TCC, monografia, estágio, relatórios, artigos científicos, revisão ABNT e muito mais. Mentores especialistas, originalidade garantida.",
  keywords: [
    "consultoria acadêmica",
    "TCC",
    "monografia",
    "relatório de estágio",
    "ABNT",
    "mentoria acadêmica",
    "artigo científico",
    "MentorUp",
  ],
  authors: [{ name: "MentorUp" }],
  openGraph: {
    title: "MentorUp — Consultoria Acadêmica de Excelência",
    description:
      "TCC, estágio, relatórios e muito mais. Mentoria de excelência para sua jornada acadêmica.",
    type: "website",
    locale: "pt_BR",
    siteName: "MentorUp",
  },
  twitter: {
    card: "summary_large_image",
    title: "MentorUp — Consultoria Acadêmica",
    description:
      "Consultoria acadêmica completa com mentores especialistas.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDict, getLang } from "@/i18n";
import { I18nProvider } from "@/components/I18nProvider";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/server/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Parking",
  description: "Smart Parking Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();
  const dict = getDict(lang);
  const user = await getCurrentUser();

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
      >
        <I18nProvider lang={lang} dict={dict}>
          <AppShell user={user}>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}

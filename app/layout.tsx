import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "خان الجمر | المنيو الإلكتروني",
  description: "منيو خان الجمر الإلكتروني — مشويات تركية على الجمر في كركوك.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}

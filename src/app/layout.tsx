import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Mortgage Freedom Simulator | Infinite Wealth",
  description: "Discover how much you could save with the Infinite Wealth Offset Strategy. See how fast you could be mortgage-free.",
  keywords: ["mortgage calculator", "offset account", "Australian mortgage", "mortgage freedom", "infinite wealth"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

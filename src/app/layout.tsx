import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galaxy Viewer - Interactive 3D Galaxy Explorer",
  description: "Explore the cosmos with this interactive 3D galaxy visualization featuring stars, nebulae, and cosmic phenomena.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}

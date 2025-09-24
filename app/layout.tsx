import type { Metadata } from "next";
import { Inter, Dela_Gothic_One } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-dela-gothic",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio showcasing creative development work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${delaGothic.variable} font-sans antialiased bg-black overflow-x-hidden min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

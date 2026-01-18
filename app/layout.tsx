import type { Metadata } from "next";
import { Inter, Dela_Gothic_One, Space_Grotesk } from 'next/font/google';
import "./globals.css";
import ClientHydrate from '../components/ClientHydrate';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-dela-gothic",
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300','400','500','600','700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
      <body className={`hydrating ${inter.variable} ${delaGothic.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ClientHydrate />
        {children}
      </body>
    </html>
  );
}

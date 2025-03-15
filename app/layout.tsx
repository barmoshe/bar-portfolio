import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar-new";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/contexts/theme-context";
import { ThemeSelector } from "@/components/theme-selector";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bar Moshe | Software Developer & DevOps Enthusiast",
  description:
    "Portfolio of Bar Moshe - Software Developer and DevOps Enthusiast skilled in building scalable applications and cloud solutions.",
  generator: "v0.dev",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans overflow-x-hidden`}>
        <ThemeProvider defaultTheme="blue">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ThemeSelector />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";

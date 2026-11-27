import type { Metadata } from "next";
import { Alfa_Slab_One, Oswald, Source_Sans_3 } from "next/font/google";
import { Suspense } from "react";
import { DemoProvider } from "@/lib/demo-store";
import { DemoBar } from "@/components/demo-bar";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const brand = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alfa",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: {
    default: "Adams Services",
    template: "%s · Adams Services",
  },
  description: "Residential and commercial waste collection in Bastrop, Texas. Working prototype on sample data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${brand.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <DemoProvider>
          <Suspense fallback={null}>
            <DemoBar />
          </Suspense>
          {children}
        </DemoProvider>
      </body>
    </html>
  );
}

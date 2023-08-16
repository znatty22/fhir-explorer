import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import Navbar from "@/components/Navbar";

const nunito = localFont({
  src: "./fonts/Nunito-VariableFont_wght.ttf",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "FHIR Explorer",
  description: "Explore data in D3b FHIR servers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className={nunito.className}>
        <div className="bg-slate-50">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}

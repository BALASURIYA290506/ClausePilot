import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClausePilot — Understand what your legal document says. Know what to ask next.",
  description: "GenAI-powered legal document intelligence application that turns complex legal documents into structured, grounded action maps and plain-English insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary-500/30 selection:text-white bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}

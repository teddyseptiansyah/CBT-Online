import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPSCBT — Platform Ujian Online",
  description: "Platform CBT open-source untuk sekolah dan institusi pendidikan.",
  icons: "HeaderLogo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
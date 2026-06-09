import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — OPSCBT",
  description: "Masuk ke platform ujian online OPSCBT",
  icons: "HeaderLogo.svg",
};

export default function SigninLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
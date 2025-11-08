import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastAPI + Next.js App",
  description: "Full-stack application with FastAPI and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

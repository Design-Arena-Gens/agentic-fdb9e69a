import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chand Ki Kahani",
  description: "एक इंटरएक्टिव हिंदी कहानी जिसका पाठक कथानक चुन सकता है।"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cairo, Noto_Sans } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-ar",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apex Meridian OCC",
  description: "EgyptAir Operations Control Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} ${notoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

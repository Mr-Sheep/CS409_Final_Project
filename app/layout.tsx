import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventLawnchair",
  description: "Discover and manage events easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen items-center justify-between bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            EventLawnchair
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zapac Admin",
  description: "Admin dashboard for Zap Around Cebu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

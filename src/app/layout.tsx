import type { Metadata } from "next";
// The lines below are commented out to resolve preview environment errors.
// They are standard in a local Next.js setup.
// import { Inter } from "next/font/google";
// import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhiselink - Building Somalia's Future",
  description: "Connecting Somalia's talent with opportunities to build a prosperous future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
      </head>
      {/* The className for the font has been removed as it's now handled globally */}
      <body>
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


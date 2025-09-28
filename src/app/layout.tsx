import type { Metadata } from "next";
import Script from "next/script";
import Header from '@/components/header';
import Footer from '@/components/footer';
import SupabaseProvider from '@/components/SupabaseProvider';
import './globals.css';

export const metadata: Metadata = {
  title: "Dhiselink - Connecting Talent with Opportunity in Somaliland",
  description: "The central hub for professionals, companies, universities, and government bodies to build the future of Somaliland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SupabaseProvider>
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
        </SupabaseProvider>

        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" strategy="afterInteractive" />
      </body>
    </html>
  );
}
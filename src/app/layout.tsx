// File Path: app/layout.tsx

import type { Metadata } from "next";
import Script from "next/script";

// 1. Correctly import your external Header and Footer components
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: "Dhiselink - Connecting Talent with Opportunity in Somaliland",
  description: "The central hub for professionals, companies, universities, and government bodies to build the future of Somaliland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 2. Your original <head> tag with Google Fonts is restored */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header /> {/* This now uses your new, modern header */}

        {/* This 'pt-20' class is important. It adds padding to the top of the page 
            so your content isn't hidden underneath the sticky header. */}
        <main className="pt-20">{children}</main>

        <Footer /> {/* This now uses your footer file */}

        {/* 3. Your original Script tags are restored */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" strategy="afterInteractive" />
      </body>
    </html>
  );
}
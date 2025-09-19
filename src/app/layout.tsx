// File Path: app/layout.tsx

import type { Metadata } from "next";
// Removed problematic imports for Next.js specific features

// --- Placeholder Components ---
// In a real Next.js environment, these would be in separate files.
// We are including them here to make the layout self-contained and fix build errors.

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <a href="/" className="text-2xl font-black tracking-tighter text-gray-900">
        Dhiselink
      </a>
      <div className="hidden md:flex items-center space-x-8">
        <a href="/about" className="font-bold text-gray-700 hover:text-blue-600">About</a>
        <a href="/companies" className="font-bold text-gray-700 hover:text-blue-600">Organizations</a>
        <a href="/opportunities" className="font-bold text-gray-700 hover:text-blue-600">Opportunities</a>
        <a href="/contact" className="font-bold text-gray-700 hover:text-blue-600">Contact</a>
      </div>
      <a href="/register" className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-shadow">
        Join Dhiselink
      </a>
    </nav>
  </header>
);

const Footer = () => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="col-span-full lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Dhiselink</h3>
                    <p className="text-gray-400 max-w-sm">Connecting Somaliland&apos;s talent with opportunities to build a prosperous future.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Sitemap</h4>
                    <ul className="space-y-2">
                        <li><a href="/about" className="text-gray-400 hover:text-blue-400">About</a></li>
                        <li><a href="/professionals" className="text-gray-400 hover:text-blue-400">Professionals</a></li>
                        <li><a href="/opportunities" className="text-gray-400 hover:text-blue-400">Opportunities</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-blue-400">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-blue-400">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Dhiselink. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


export const metadata: Metadata = {
  title: "Dhiselink - Connecting Talent with Opportunity in Somaliland",
  description: "The central hub for professionals, companies, universities, and government bodies to build the future of Somaliland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Basic CSS Reset and Tailwind setup */}
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; font-family: 'Inter', sans-serif; }
          /* Basic Tailwind directives - in a real app, this is handled by globals.css */
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `}</style>
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Supabase Client */}
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" async></script>
        {/* Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


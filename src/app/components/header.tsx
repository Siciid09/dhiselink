"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // ✅ only if you generated types

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  // ✅ Let TS infer the type (no manual `SupabaseClient` typing)
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Dhiselink
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-700"
            } hover:text-blue-600`}
          >
            Home
          </Link>
          <Link
            href="/ideas"
            className={`${
              pathname?.startsWith("/ideas")
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:text-blue-600`}
          >
            Ideas
          </Link>
          <Link
            href="/projects"
            className={`${
              pathname?.startsWith("/projects")
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:text-blue-600`}
          >
            Projects
          </Link>
          <Link
            href="/about"
            className={`${
              pathname === "/about"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:text-blue-600`}
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

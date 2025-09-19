"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ---- Types ----
type DropdownLink = {
  name: string;
  href: string;
  description: string;
};

type NavLink = {
  name: string;
  href: string; // always a string (use "#" if just a parent)
  isDropdown?: boolean;
  dropdownLinks?: DropdownLink[];
};

// ---- Navigation links ----
const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Community",
    href: "#", // parent only
    isDropdown: true,
    dropdownLinks: [
      { name: "Professionals", href: "/professionals", description: "Discover top-tier talent." },
      { name: "Companies", href: "/companies", description: "Find leading institutions." },
      { name: "Universities", href: "/universities", description: "Explore academic partners." },
      { name: "Governments & NGOs", href: "/government-ngos", description: "View public sector entities." },
    ],
  },
  {
    name: "Opportunities",
    href: "#", // parent only
    isDropdown: true,
    dropdownLinks: [
      { name: "Jobs", href: "/opportunities", description: "Find your next career move." },
      { name: "Idea Hub", href: "/ideas", description: "Collaborate on new ventures." },
    ],
  },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // ---- Supabase Auth ----
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900">
          Dhiselink
        </Link>

        {/* ---- Desktop Navigation ---- */}
        <div className="hidden lg:flex items-center space-x-8" onMouseLeave={() => setOpenDropdown(null)}>
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.isDropdown && setOpenDropdown(link.name)}
            >
              <div className="flex items-center gap-1 font-bold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                {link.isDropdown ? (
                  <span>{link.name}</span>
                ) : (
                  <Link href={link.href}>{link.name}</Link>
                )}
                {link.isDropdown && <ChevronDown size={16} />}
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {link.isDropdown && openDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white rounded-lg shadow-2xl border"
                  >
                    <div className="p-2">
                      {link.dropdownLinks?.map((dLink) => (
                        <Link
                          key={dLink.name}
                          href={dLink.href}
                          className="block p-3 hover:bg-gray-50 rounded-md"
                        >
                          <p className="font-semibold text-gray-800">{dLink.name}</p>
                          <p className="text-sm text-gray-500">{dLink.description}</p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ---- Desktop Auth ---- */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-gray-100 text-gray-800 text-sm font-bold px-5 py-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-gray-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/register"
              className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-shadow"
            >
              Join Dhiselink
            </Link>
          )}
        </div>

        {/* ---- Mobile Menu Button ---- */}
        <button className="lg:hidden z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ---- Mobile Menu Panel ---- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-24 p-6"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-2xl font-bold text-gray-800 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t pt-6 flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center bg-gray-100 text-gray-800 font-bold px-6 py-4 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center bg-red-500 text-white font-bold px-6 py-4 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center bg-blue-600 text-white font-bold px-6 py-4 rounded-lg"
                >
                  Join Dhiselink
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Home, Users, Building, Briefcase, Info, LogIn, UserPlus, LucideProps, ForwardRefExoticComponent, RefAttributes } from "lucide-react";
import clsx from "clsx";

// --- NAVIGATION TYPES ---
type NavItemCore = {
  name: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

type NavItemWithDropdown = NavItemCore & {
  dropdown: Array<{ name: string; href: string; description: string }>;
  href?: undefined;
};

type NavItemWithoutDropdown = NavItemCore & {
  href: string;
  dropdown?: undefined;
};

type NavItem = NavItemWithDropdown | NavItemWithoutDropdown;

// --- NAV ITEMS ---
const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Professionals", href: "/professionals", icon: Users },
  {
    name: "Organizations",
    icon: Building,
    dropdown: [
      { name: "Companies", href: "/companies", description: "Leading private sector firms" },
      { name: "Universities", href: "/universities", description: "Academic & research institutions" },
      { name: "Government & NGOs", href: "/government-ngos", description: "Public sector & other entities" },
    ],
  },
  {
    name: "Opportunities",
    icon: Briefcase,
    dropdown: [
      { name: "Jobs", href: "/opportunities", description: "Find your next career move" },
      { name: "Ideas", href: "/ideas", description: "Collaborate on new ventures" },
    ],
  },
  { name: "About", href: "/about", icon: Info },
];

// --- HEADER COMPONENT ---
export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const supabase: SupabaseClient<any, "public", "public"> = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, dropdownHrefs?: string[]) => {
    if (pathname === href) return true;
    if (dropdownHrefs) return dropdownHrefs.some((dh) => pathname.startsWith(dh));
    return false;
  };

  // --- SCROLL DETECTION ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- SESSION MANAGEMENT ---
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className={clsx("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/70 backdrop-blur-xl shadow-lg border border-slate-200/80" : "bg-transparent")}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">Dhiselink</Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-2 font-medium text-sm">
              {navItems.map((item) => {
                const itemIsActive = isActive(item.href ?? "", item.dropdown?.map((d) => d.href));
                return item.dropdown ? (
                  <Menu as="div" className="relative" key={item.name}>
                    <Menu.Button className={clsx("px-4 py-2 flex items-center gap-1 rounded-lg transition-colors", itemIsActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900")}>
                      <item.icon size={16} />
                      {item.name} <ChevronDown size={16} />
                    </Menu.Button>
                    <Transition as={motion.div} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                      <Menu.Items className="absolute mt-2 w-56 bg-white rounded-xl shadow-lg p-2">
                        {item.dropdown.map((subItem) => (
                          <Menu.Item key={subItem.name}>
                            {({ active }) => (
                              <Link href={subItem.href} className={clsx("block p-2 rounded-lg", active && "bg-slate-100")}>
                                <p className="font-semibold text-slate-800">{subItem.name}</p>
                                <p className="text-xs text-slate-500">{subItem.description}</p>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link key={item.name} href={item.href} className={clsx("px-4 py-2 rounded-lg transition-colors", itemIsActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900")}>
                    <item.icon size={16} /> {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100">Dashboard</Link>
                  <button onClick={handleSignOut} className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-1"><LogIn size={16}/> Login</Link>
                  <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1"><UserPlus size={16}/> Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-600">
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-50 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>✕</button>
              </div>
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.name}>
                      <p className="font-bold flex items-center gap-2">{item.icon({} as any)} {item.name}</p>
                      {item.dropdown.map((sub) => (
                        <Link href={sub.href} key={sub.name} className="pl-4 py-2 block text-slate-600 hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={item.name} href={item.href} className="flex items-center gap-2 py-2 text-slate-600 hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
                      {item.icon({} as any)} {item.name}
                    </Link>
                  )
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

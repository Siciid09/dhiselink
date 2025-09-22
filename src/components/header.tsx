"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, RefAttributes, ForwardRefExoticComponent } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, Building, Home, Info, Users, LucideProps, LogIn, UserPlus } from 'lucide-react';
import clsx from 'clsx';

// --- Type Definitions ---
type NavItemCore = {
  name: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

type NavItemWithDropdown = NavItemCore & {
  dropdown: Array<{ name: string; href: string; description: string; }>;
  href?: undefined;
};

type NavItemWithoutDropdown = NavItemCore & {
  href: string;
  dropdown?: undefined;
};

type NavItem = NavItemWithDropdown | NavItemWithoutDropdown;

// --- Navigation Items Configuration ---
const navItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Professionals', href: '/professionals', icon: Users },
  {
    name: 'Organizations',
    icon: Building,
    dropdown: [
      { name: 'Companies', href: '/companies', description: 'Leading private sector firms' },
      { name: 'Universities', href: '/universities', description: 'Academic and research institutions' },
      { name: 'Government & Others', href: '/government-ngos', description: 'Public sector & other entities' },
    ],
  },
  {
    name: 'Opportunities',
    icon: Briefcase,
    dropdown: [
      { name: 'Jobs', href: '/opportunities', description: 'Find your next career move' },
      { name: 'Ideas', href: '/ideas', description: 'Collaborate on new ventures' },
    ],
  },
  { name: 'About', href: '/about', icon: Info },
];

// --- Animated Hamburger Icon Component ---
const AnimatedHamburgerIcon = ({ isOpen, ...props }: { isOpen: boolean; [key: string]: any }) => {
  const topVariants = { closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7.5 } };
  const middleVariants = { closed: { opacity: 1 }, open: { opacity: 0 } };
  const bottomVariants = { closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7.5 } };

  return (
    <button {...props}>
      <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" animate={isOpen ? 'open' : 'closed'} initial={false} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
        <motion.line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={topVariants} />
        <motion.line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={middleVariants} />
        <motion.line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={bottomVariants} />
      </motion.svg>
    </button>
  );
};

// --- Main Header Component ---
export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // NEW: State to track scroll position
  const [scrolled, setScrolled] = useState(false);

  const supabase: SupabaseClient = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, dropdownHrefs?: string[]) => {
    if (pathname === href) return true;
    if (dropdownHrefs) return dropdownHrefs.some(dh => pathname.startsWith(dh));
    return false;
  };

  // NEW: Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    router.push('/');
    router.refresh();
  };

  const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { duration: 0.2 } },
  };

  const mobileNavContainerVariants = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const mobileNavItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* ENHANCED: Header with dynamic classes for scroll effect */}
      <header className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "pt-0" : "pt-4"
      )}>
        <div className={clsx(
          "container mx-auto max-w-6xl px-4 transition-all duration-300",
        )}>
           <div className={clsx(
              "flex h-16 items-center justify-between rounded-xl px-4 transition-all duration-300",
              scrolled ? "bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-lg" : "bg-transparent"
           )}>
              <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">Dhiselink</Link>

              {/* ENHANCED: Desktop Navigation with Icons */}
              <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                {navItems.map((item) => {
                  const itemIsActive = isActive(item.href ?? '', item.dropdown?.map(d => d.href));
                  return item.dropdown ? (
                    <Menu as="div" className="relative" key={item.name}>
                      <Menu.Button className={clsx(
                        'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative',
                        itemIsActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      )}>
                        {itemIsActive && <motion.div layoutId="active-pill-desktop" className="absolute inset-0 bg-slate-100 rounded-lg z-0" style={{ borderRadius: 8 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}/>}
                        <item.icon size={16} className="relative z-10" />
                        <span className="relative z-10">{item.name}</span>
                        <ChevronDown size={16} className="relative z-10" />
                      </Menu.Button>
                      <Transition as={motion.div} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute z-10 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                          {item.dropdown.map((subItem) => (
                            <Menu.Item key={subItem.name}>
                              {({ active }) => (
                                <Link href={subItem.href} className={clsx('block w-full text-left p-3 rounded-lg transition-colors', active && 'bg-slate-100')}>
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
                    <Link href={item.href} key={item.name} className={clsx(
                        'px-4 py-2 rounded-lg transition-colors relative flex items-center gap-2',
                        itemIsActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      )}>
                      {itemIsActive && <motion.div layoutId="active-pill-desktop" className="absolute inset-0 bg-slate-100 rounded-lg" style={{ borderRadius: 8 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}/>}
                      <item.icon size={16} className="relative z-10" />
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="hidden md:flex items-center gap-2">
                {session ? (
                  <>
                    <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-all">Dashboard</Link>
                    <button onClick={handleSignOut} className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-all">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2"><LogIn size={16}/> Login</Link>
                    <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_0_rgb(0,118,255,23%)] flex items-center gap-2"><UserPlus size={16}/> Sign Up</Link>
                  </>
                )}
              </div>

              <div className="md:hidden">
                <AnimatedHamburgerIcon isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-600 z-50 relative" aria-label="Toggle menu" />
              </div>
           </div>
        </div>
      </header>

      {/* ENHANCED: Mobile Menu with Icons */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit" className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <span className="text-xl font-bold tracking-tight">Menu</span>
                <AnimatedHamburgerIcon isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-slate-600" aria-label="Close menu"/>
              </div>
              <div className="flex-1 overflow-y-auto">
                <motion.nav className="flex flex-col space-y-1 p-6" variants={mobileNavContainerVariants} initial="hidden" animate="visible">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileNavItemVariants}>
                      {item.dropdown ? (
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-900 px-4 pt-4 pb-2 flex items-center gap-3 text-lg"><item.icon size={20}/> {item.name}</p>
                          {item.dropdown.map(subItem => (
                            <Link href={subItem.href} key={subItem.name} className="pl-12 pr-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-base" onClick={() => setIsMobileMenuOpen(false)}>{subItem.name}</Link>
                          ))}
                        </div>
                      ) : (
                        <Link href={item.href} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-md text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}><item.icon size={20}/> {item.name}</Link>
                      )}
                    </motion.div>
                  ))}
                </motion.nav>
                <div className="border-t border-slate-200 mt-2 p-6 flex flex-col gap-2">
                  {session ? (
                    <>
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 font-semibold text-slate-700 bg-slate-100 rounded-lg">Dashboard</Link>
                      <button onClick={handleSignOut} className="w-full text-center px-4 py-3 font-semibold text-white bg-slate-800 rounded-lg">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-2"><LogIn size={16}/> Login</Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2"><UserPlus size={16}/> Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
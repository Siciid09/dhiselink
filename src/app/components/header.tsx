"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, RefAttributes, ForwardRefExoticComponent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, Building, Home, Info, Users, LucideProps, LogIn, UserPlus } from 'lucide-react';
import clsx from 'clsx';
import type { Database } from '../database.types'; // <- Make sure path matches your project

// Type Definitions
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

// Navigation Items Configuration
const navItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Professionals', href: '/professionals', icon: Users },
  {
    name: 'Organizations',
    icon: Building,
    dropdown: [
      { name: 'Companies', href: '/companies', description: 'Leading private sector firms' },
      { name: 'Universities', href: '/universities', description: 'Academic & research institutions' },
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

// Animated Hamburger
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

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Updated Supabase client with Database typing
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, dropdownHrefs?: string[]) => {
    if (pathname === href) return true;
    if (dropdownHrefs) return dropdownHrefs.some(dh => pathname.startsWith(dh));
    return false;
  };

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

  // Mobile menu animation variants
  const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { duration: 0.2 } },
  };
  const mobileNavContainerVariants = { visible: { transition: { staggerChildren: 0.08 } } };
  const mobileNavItemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      {/* Header */}
      <header className={clsx("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "pt-0" : "pt-4")}>
        <div className="container mx-auto max-w-6xl px-4 transition-all duration-300">
          <div className={clsx("flex h-16 items-center justify-between rounded-xl px-4 transition-all duration-300", scrolled ? "bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-lg" : "bg-transparent")}>
            <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">Dhiselink</Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              {navItems.map((item) => {
                const itemIsActive = isActive(item.href ?? '', item.dropdown?.map(d => d.href));
                return item.dropdown ? (
                  <Menu as="div" className="relative" key={item.name}>
                    <Menu.Button className={clsx('px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative', itemIsActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900')}>
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
                  <Link href={item.href} key={item.name} className={clsx('px-4 py-2 rounded-lg transition-colors relative flex items-center gap-2', itemIsActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900')}>
                    {itemIsActive && <motion.div layoutId="active-pill-desktop" className="absolute inset-0 bg-slate-100 rounded-lg" style={{ borderRadius: 8 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}/>}
                    <item.icon size={16} class

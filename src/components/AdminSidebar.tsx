"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, Settings } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users }, // Future page
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },   // Future page
  { name: 'Settings', href: '/admin/settings', icon: Settings }, // Future page
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-800 text-white hidden md:flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-slate-700">
        <Link href="/" className="text-xl font-bold">
          Dhiselink<span className="text-blue-400">.</span> Admin
        </Link>
      </div>
      <nav className="flex-grow px-4 py-6">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <link.icon size={20} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-slate-700">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          &larr; Back to Main Site
        </Link>
      </div>
    </aside>
  );
}
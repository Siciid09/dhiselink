// File Path: app/admin/_components/AdminSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building, Briefcase, Lightbulb, Settings, LogOut } from 'lucide-react';

const navLinks = [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/organizations", label: "Organizations", icon: Building },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/admin/ideas", label: "Ideas", icon: Lightbulb },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden border-r bg-gray-100/40 md:block w-64">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">Dhiselink Admin</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {navLinks.map(link => (
                             <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${pathname === link.href && 'bg-gray-200 text-gray-900'}`}>
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    );
}
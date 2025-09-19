// File Path: app/dashboard/_components/SidebarNav.tsx

"use client";

import { usePathname } from 'next/navigation';
import { Home, User, Settings, LogOut, Lightbulb, Briefcase } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

// Navigation items for the dashboard sidebar
const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile & Settings', href: '/dashboard/profile', icon: User },
    { name: 'Submit an Idea', href: '/dashboard/submit-idea', icon: Lightbulb },
    { name: 'Post a Job', href: '/dashboard/post-job', icon: Briefcase }, // Example for organizations
];

export function SidebarNav() {
    const pathname = usePathname();
    const supabase = createClientComponentClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Use window.location to ensure a full page refresh that clears user state
        window.location.href = '/'; 
    };
    
    return (
        <nav className="flex flex-col space-y-1 bg-white p-4 rounded-lg border shadow-sm">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 
                        ${pathname === item.href ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}
                >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                </Link>
            ))}
            {/* Divider */}
            <hr className="my-2" />
            <button
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-red-600 transition-all hover:bg-red-50"
            >
                <LogOut className="h-4 w-4" />
                Sign Out
            </button>
        </nav>
    );
}

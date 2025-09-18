import Link from 'next/link';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

const socialLinks = [
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <Linkedin />, href: '#', label: 'LinkedIn' },
    { icon: <Facebook />, href: '#', label: 'Facebook' },
];

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-full lg:col-span-2">
                        <h3 className="text-xl font-bold mb-4">Dhiselink</h3>
                        <p className="text-gray-400 max-w-sm">Connecting Somalia's talent with opportunities to build a prosperous future.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Sitemap</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link href="/professionals" className="text-gray-400 hover:text-blue-400 transition-colors">Professionals</Link></li>
                            <li><Link href="/opportunities" className="text-gray-400 hover:text-blue-400 transition-colors">Opportunities</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Dhiselink. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        {socialLinks.map(link => (<a key={link.label} href={link.href} aria-label={link.label} className="text-gray-400 hover:text-white transition-colors">{link.icon}</a>))}
                    </div>
                </div>
            </div>
        </footer>
    );
}


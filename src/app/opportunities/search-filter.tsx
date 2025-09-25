"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition, ChangeEvent } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleFilterChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    }, 300);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-lg mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    name="q"
                    placeholder="Search by title, company..."
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={handleFilterChange}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-500 outline-none"
                />
            </div>
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    name="location"
                    placeholder="Location (e.g., Hargeisa)"
                    defaultValue={searchParams.get('location')?.toString()}
                    onChange={handleFilterChange}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-500 outline-none"
                />
            </div>
            <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                    name="type"
                    defaultValue={searchParams.get('type')?.toString()}
                    onChange={handleFilterChange}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent appearance-none focus:ring-2 focus:ring-sky-500 outline-none"
                >
                    <option value="">All Job Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>
            </div>
        </div>
    );
}
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, ChangeEvent } from 'react';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, company..."
          defaultValue={searchParams.get('q')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-md bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Location Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Hargeisa)"
          defaultValue={searchParams.get('location')?.toString()}
          onChange={handleFilterChange}
          className="w-full h-12 pl-10 pr-4 rounded-md bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Job Type Select */}
      <div className="relative">
        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          name="type"
          defaultValue={searchParams.get('type')?.toString()}
          onChange={handleFilterChange}
          className="w-full h-12 pl-10 pr-4 rounded-md bg-gray-100 border-transparent appearance-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>
      {isPending && <Loader2 className="animate-spin absolute right-4 top-4" />}
    </div>
  );
}
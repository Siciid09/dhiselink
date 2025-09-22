"use client"; // This directive marks it as a Client Component

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Star } from 'lucide-react';

// The JobCard component now lives in its own file.
// It receives the 'job' data as a prop.
export default function JobCard({ job }: { job: any }) {
  return (
    <Link href={`/opportunities/${job.id}`} className="block group">
      <motion.div 
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        className="bg-white rounded-lg border p-6 h-full flex flex-col transition-shadow duration-300 relative overflow-hidden"
      >
        {job.featured && <Star size={16} className="absolute top-4 right-4 text-yellow-400 fill-current" />}
        <div className="flex items-start gap-4">
          <img 
            src={job.organization_logo_url || `https://placehold.co/64x64/e2e8f0/4a5568?text=${job.organization_name?.charAt(0) || 'J'}`} 
            alt={`${job.organization_name} logo`} 
            className="h-12 w-12 object-contain rounded-md border p-1 flex-shrink-0 bg-white" 
          />
          <div>
            <p className="text-sm font-semibold text-blue-600">{job.organization_name}</p>
            <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 my-3 flex-grow">{job.short_description}</p>
        <div className="flex flex-wrap gap-2 my-3">
            {job.tags?.map((tag: string) => <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>)}
        </div>
        <div className="text-sm text-gray-500 mt-auto pt-3 border-t flex items-center justify-between">
          <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
          <span className="flex items-center gap-1.5 capitalize"><Briefcase size={14} /> {job.type}</span>
        </div>
      </motion.div>
    </Link>
  );
}
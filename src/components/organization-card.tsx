"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';

// Define the shape of a generic organization profile
type OrganizationProfile = {
  id: string;
  organization_name: string;
  bio: string | null;
  location: string | null;
  employee_count: number | null;
  logo_url: string | null;
};

// Animation variant for the card
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function OrganizationCard({ profile }: { profile: OrganizationProfile }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/organizations/${profile.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-slate-200 h-full flex flex-col p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={profile.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.organization_name}`}
              alt={`${profile.organization_name} logo`}
              className="h-16 w-16 object-contain rounded-lg border p-1"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {profile.organization_name}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin size={14} /> {profile.location || 'Not specified'}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 flex-grow line-clamp-3">
            {profile.bio || 'No summary available.'}
          </p>
          {profile.employee_count && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                <Users size={14} /> {profile.employee_count}+ Members
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
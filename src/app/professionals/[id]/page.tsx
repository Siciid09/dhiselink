import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Mail, Globe, Linkedin, Github, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';

async function getProfile(id: string) {
    const supabase = createServerComponentClient({ cookies });
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'individual')
        .single();
    return profile;
}

export default async function ProfessionalDetailPage({ params }: { params: { id: string } }) {
    const profile = await getProfile(params.id);
    if (!profile) notFound();

    const socialLinks = [
        { href: profile.website_url, icon: Globe, label: "Website" },
        { href: profile.linkedin_url, icon: Linkedin, label: "LinkedIn" },
        { href: profile.github_url, icon: Github, label: "GitHub" },
    ].filter(link => link.href);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto max-w-5xl py-24 px-4">
                {/* --- Banner Image --- */}
                <div className="h-48 md:h-64 bg-slate-200 rounded-2xl relative mb-[-80px] overflow-hidden">
                    {profile.banner_url && <img src={profile.banner_url} alt="Cover photo" className="w-full h-full object-cover" />}
                </div>

                <div className="relative bg-white rounded-2xl shadow-xl border p-8">
                    {/* --- Header Section --- */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        <img src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`} alt={profile.full_name} className="w-40 h-40 rounded-full border-8 border-white shadow-lg flex-shrink-0" />
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{profile.full_name}</h1>
                            <p className="text-xl font-medium text-blue-600 mt-1">{profile.professional_title}</p>
                            <p className="text-slate-500 mt-2 flex items-center justify-center sm:justify-start gap-2"><MapPin size={16} />{profile.location || 'Location not provided'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             {socialLinks.map(link => (
                                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-500 hover:text-white transition-all">
                                    <link.icon size={20} />
                                </a>
                             ))}
                        </div>
                    </div>
                    
                    {/* --- Main Content --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="md:col-span-2">
                             <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-4">About Me</h2>
                             <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio || 'No bio provided.'}</p>
                        </div>
                        <div className="md:col-span-1 space-y-6">
                             <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">{profile.skills?.map((s: string) => <span key={s} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{s}</span>)}</div>
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Languages</h3>
                                <div className="flex flex-wrap gap-2">{profile.languages?.map((l: string) => <span key={l} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{l}</span>)}</div>
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">Certifications</h3>
                                <div className="flex flex-wrap gap-2">{profile.certifications?.map((c: string) => <span key={c} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{c}</span>)}</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

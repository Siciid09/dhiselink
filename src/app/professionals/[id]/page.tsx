import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Mail, Globe, Linkedin, Github, MapPin, Briefcase, GraduationCap, User, FileText, Calendar } from 'lucide-react';
import React from 'react';

// Reusable component for each section of the profile
const ProfileSection = ({ title, icon: Icon, children, hasContent }: { title: string; icon: React.ElementType; children: React.ReactNode; hasContent: boolean; }) => {
    if (!hasContent) return null;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4">
                <Icon className="text-sky-500" size={24} />
                <span>{title}</span>
            </h2>
            {children}
        </div>
    );
};

export default async function ProfessionalDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();

    if (!profile || profile.role !== 'individual') {
        notFound();
    }

    const socialLinks = [
        { href: profile.website_url, icon: Globe },
        { href: profile.linkedin_url, icon: Linkedin },
        { href: profile.github_url, icon: Github },
    ].filter(link => link.href);

    // Check if dynamic sections have content
    const hasWorkExperience = Array.isArray(profile.work_experience) && profile.work_experience.length > 0;
    const hasEducation = Array.isArray(profile.education) && profile.education.length > 0;
    const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto max-w-5xl py-16 sm:py-24 px-4">
                {/* --- HEADER --- */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 mb-12 flex flex-col sm:flex-row items-center gap-8">
                    <img
                        src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`}
                        alt={profile.full_name || ''}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-sky-100 shadow-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{profile.full_name}</h1>
                        <p className="text-xl font-medium text-sky-600 mt-1">{profile.professional_title}</p>
                        <p className="text-slate-500 mt-2 flex items-center justify-center sm:justify-start gap-2">
                            <MapPin size={16} />{profile.location || "Not provided"}
                        </p>
                        <div className="flex gap-2 justify-center sm:justify-start mt-4">
                            {socialLinks.map(link => (
                                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-sky-500 hover:text-white transition">
                                    <link.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    {profile.resume_url && (
                        <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-700">
                            <FileText size={18} /> Download CV
                        </a>
                    )}
                </div>

                {/* --- MAIN LAYOUT (2 Columns) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left / Main Column --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <ProfileSection title="About Me" icon={User} hasContent={!!profile.bio}>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
                        </ProfileSection>

                        <ProfileSection title="Work Experience" icon={Briefcase} hasContent={hasWorkExperience}>
                            <div className="space-y-6 border-l-2 border-slate-200 ml-2">
                                {profile.work_experience.map((exp: any, i: number) => (
                                    <div key={i} className="pl-6 relative before:absolute before:left-[-9px] before:top-1 before:w-4 before:h-4 before:bg-sky-500 before:rounded-full before:border-4 before:border-slate-50">
                                        <h4 className="font-bold text-slate-800">{exp.title} at {exp.company}</h4>
                                        <p className="text-sm text-slate-500">{exp.duration}</p>
                                    </div>
                                ))}
                            </div>
                        </ProfileSection>

                        <ProfileSection title="Education" icon={GraduationCap} hasContent={hasEducation}>
                            <div className="space-y-4">
                                {profile.education.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-slate-800">{edu.level} in {edu.field}</h4>
                                        <p className="text-sm text-slate-500">{edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        </ProfileSection>
                    </div>

                    {/* --- Right / Sidebar Column --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <ProfileSection title="Professional Info" icon={Calendar} hasContent={true}>
                             <div className="text-slate-600 space-y-2 text-sm">
                                {profile.experience_level && <p><span className="font-semibold text-slate-700">Experience Level:</span> {profile.experience_level}</p>}
                                {profile.years_of_experience && <p><span className="font-semibold text-slate-700">Years of Experience:</span> {profile.years_of_experience}</p>}
                                {profile.industry && <p><span className="font-semibold text-slate-700">Industry:</span> {profile.industry}</p>}
                             </div>
                        </ProfileSection>
                        
                        <ProfileSection title="Skills" icon={Briefcase} hasContent={hasSkills}>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((s: string) => (
                                    <span key={s} className="bg-sky-100 text-sky-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                                ))}
                            </div>
                        </ProfileSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
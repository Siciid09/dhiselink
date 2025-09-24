import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Mail, Globe, Linkedin, Github, MapPin, Briefcase, GraduationCap, Award, Languages, User as UserIcon } from 'lucide-react';
import React from 'react';

const ProfileSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => {
  if (!children) return null;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-4">
        <Icon className="text-blue-500" size={24} />
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
};

export default async function ProfessionalDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single();

  if (!profile || profile.role !== 'individual') notFound();

  const socialLinks = [
    { href: profile.website_url, icon: Globe },
    { href: profile.linkedin_url, icon: Linkedin },
    { href: profile.github_url, icon: Github },
    { href: `mailto:${profile.email}`, icon: Mail },
  ].filter(link => link.href && link.href !== 'mailto:null');

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-5xl py-16 sm:py-24 px-4">
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-xl border">
          {/* Cover Banner */}
          <div className="h-48 md:h-64 w-full overflow-hidden rounded-t-2xl">
            {profile.banner_url ? (
              <img src={profile.banner_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-600" />
            )}
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <img
                src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`}
                alt={profile.full_name || ''}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Name + Title + Location + Social */}
          <div className="mt-20 flex flex-col items-center text-center gap-2 px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{profile.full_name}</h1>
            <p className="text-xl font-medium text-blue-600">{profile.professional_title}</p>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <MapPin size={16} />
              {profile.location || "Not provided"}
            </p>
            <div className="flex gap-2 mt-4">
              {socialLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-500 hover:text-white transition"
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- Main Sections --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-8">
            {profile.bio && (
              <ProfileSection title="About Me" icon={UserIcon}>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </ProfileSection>
            )}

            <ProfileSection title="Work Experience" icon={Briefcase}>
              {Array.isArray(profile.work_experience) && profile.work_experience.length > 0 ? (
                <div className="space-y-6 border-l-2 border-slate-200 ml-2">
                  {profile.work_experience.map((exp: any, i: number) => (
                    <div key={i} className="pl-6 relative before:absolute before:left-[-9px] before:top-1 before:w-4 before:h-4 before:bg-blue-500 before:rounded-full before:border-4 before:border-slate-50">
                      <h4 className="font-bold text-slate-800">{exp.title} at {exp.company}</h4>
                      <p className="text-sm text-slate-500">{exp.duration}</p>
                      <p className="text-slate-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No work experience provided.</p>
              )}
            </ProfileSection>

            <ProfileSection title="Education" icon={GraduationCap}>
              {Array.isArray(profile.education) && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu: any, i: number) => (
                    <div key={i}>
                      <h4 className="font-bold text-slate-800">{edu.degree} from {edu.school}</h4>
                      <p className="text-sm text-slate-500">{edu.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No education provided.</p>
              )}
            </ProfileSection>
          </div>

          {/* Right / Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileSection title="Skills" icon={Briefcase}>
              {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s: string) => (
                    <span key={s} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No skills provided.</p>
              )}
            </ProfileSection>

            <ProfileSection title="Languages" icon={Languages}>
              {Array.isArray(profile.languages) && profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((l: string) => (
                    <span key={l} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{l}</span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No languages provided.</p>
              )}
            </ProfileSection>

            <ProfileSection title="Certifications" icon={Award}>
              {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {profile.certifications.map((c: string) => (
                    <p key={c} className="text-slate-600">{c}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No certifications provided.</p>
              )}
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}
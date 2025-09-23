"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { AlertTriangle, CheckCircle, Save, UploadCloud } from 'lucide-react';
import { useState, useRef, Fragment } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Disclosure } from '@headlessui/react';
import { ChevronUp } from 'lucide-react';

// --- Reusable UI Components ---
function SubmitButton() { /* ... (same as before) ... */ }
const InputField = ({...}) => ( /* ... (same as before) ... */ );
const TextareaField = ({...}) => ( /* ... (same as before) ... */ );
const ImageUploadField = ({...}) => ( /* ... (same as before) ... */ );

// --- Main Form Component with Accordion Layout ---
export default function SettingsForm({ profile }: { profile: any }) {
    const [state, formAction] = useFormState(updateProfile, { error: null, success: false });

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={profile.role} />
            
            {/* --- INDIVIDUAL FORM --- */}
            {profile.role === 'individual' && (
              <div className="space-y-4">
                <Disclosure defaultOpen>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                        <span>Basic Info</span> <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className="pt-4 space-y-4">
                          <ImageUploadField label="Profile Photo" name="avatar_url" defaultValue={profile.avatar_url} bucketName="avatars" />
                          <ImageUploadField label="Cover Photo (Banner)" name="banner_url" defaultValue={profile.banner_url} bucketName="avatars" />
                          <InputField label="Full Name" name="full_name" defaultValue={profile.full_name} />
                          <InputField label="Professional Title" name="professional_title" defaultValue={profile.professional_title} />
                          <InputField label="Email" name="email" type="email" defaultValue={profile.email} />
                          <InputField label="Phone" name="phone" type="tel" defaultValue={profile.phone} />
                          <InputField label="Location" name="location" defaultValue={profile.location} />
                          <TextareaField label="Short Bio" name="bio" defaultValue={profile.bio} />
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>

                <Disclosure>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                        <span>Skills & Languages</span> <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className="pt-4 space-y-4">
                          <TextareaField label="Skills" name="skills" defaultValue={profile.skills} helpText="Enter skills separated by commas (e.g., React, Node.js)" />
                          <TextareaField label="Languages" name="languages" defaultValue={profile.languages} helpText="Enter languages separated by commas (e.g., English, Somali)" />
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
                
                 <Disclosure>
                  {({ open }) => (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                        <span>Experience & Education</span> <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className="pt-4 space-y-4">
                          <TextareaField label="Work Experience" name="work_experience" defaultValue={JSON.stringify(profile.work_experience, null, 2)} rows={8} helpText="Enter as a JSON array of objects. Example: [{ \"title\": \"Engineer\", \"company\": \"...\" }]" />
                          <TextareaField label="Education" name="education" defaultValue={JSON.stringify(profile.education, null, 2)} rows={8} helpText="Enter as a JSON array of objects. Example: [{ \"degree\": \"B.Sc.\", \"school\": \"...\" }]" />
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>

                <Disclosure>
                   {({ open }) => (
                     <div className="bg-slate-50 rounded-lg p-4">
                      <Disclosure.Button className="flex w-full justify-between items-center font-bold text-lg text-slate-800">
                        <span>Portfolio & Links</span> <ChevronUp className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`} />
                      </Disclosure.Button>
                       <Disclosure.Panel className="pt-4 space-y-4">
                          <InputField label="Portfolio/Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
                          <InputField label="LinkedIn Profile URL" name="linkedin_url" type="url" defaultValue={profile.linkedin_url} />
                          <InputField label="GitHub Profile URL" name="github_url" type="url" defaultValue={profile.github_url} />
                       </Disclosure.Panel>
                     </div>
                   )}
                </Disclosure>
              </div>
            )}

            {/* --- ORGANIZATION FORM --- */}
            {profile.role !== 'individual' && (
                <div className="space-y-4">
                    <InputField label="Organization Name" name="organization_name" defaultValue={profile.organization_name} />
                    <InputField label="Industry" name="industry" defaultValue={profile.industry} />
                    <ImageUploadField label="Organization Logo" name="logo_url" defaultValue={profile.logo_url} bucketName="avatars" />
                    <ImageUploadField label="Cover Photo (Banner)" name="banner_url" defaultValue={profile.banner_url} bucketName="avatars" />
                    <TextareaField label="Organization Summary (Bio)" name="bio" defaultValue={profile.bio} />
                    <InputField label="Location" name="location" defaultValue={profile.location} />
                    <InputField label="Website URL" name="website_url" type="url" defaultValue={profile.website_url} />
                    <InputField label="Contact Email" name="email" type="email" defaultValue={profile.email} />
                    <InputField label="Contact Phone" name="phone" type="tel" defaultValue={profile.phone} />
                </div>
            )}

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200">
                {state.success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={16} /><span>Profile saved!</span></div>}
                {state.error && <div className="text-red-600 flex items-center gap-2"><AlertTriangle size={16} /><span>{state.error}</span></div>}
                <SubmitButton />
            </div>
        </form>
    );
}

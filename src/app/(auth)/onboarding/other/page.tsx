"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { completeIndividualOnboarding } from "../actions"; // updated import
import { motion } from "framer-motion";
import { Package, Link as LinkIcon, Users, AlertTriangle } from "lucide-react";

export default function OtherOnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const { pending } = useFormStatus();

  async function handleSubmit(formData: FormData) {
    const result = await completeIndividualOnboarding({ error: null }, formData);
    if (result.error) setError(result.error);
  }

  return (
    <form action={handleSubmit}>
      <h1>Other Onboarding</h1>
      
      {/* Example fields */}
      <input name="full_name" placeholder="Full Name" required />
      <input name="professional_title" placeholder="Professional Title" required />
      <textarea name="bio" placeholder="Bio" />
      <input name="cv_url" placeholder="CV URL" />

      {/* Example of skills as comma separated */}
      <input name="skills" placeholder="Skills (comma separated)" />

      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Complete Onboarding"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { completeOtherOnboarding } from "../actions";
import { motion } from "framer-motion";
import { Package, Link as LinkIcon, Users, AlertTriangle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function OtherOnboardingPage() {
  return (
    <motion.div
      className="p-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6" /> Other Onboarding
      </h1>

      <form action={completeOtherOnboarding} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium">
            Details
          </label>
          <textarea
            id="details"
            name="details"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <SubmitButton />
      </form>
    </motion.div>
  );
}

"use client";

import React, { useState, FC, FormEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  Send,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/utils/supabase/client"; // Adjust path if needed

// Helper for class names
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Reusable Input Field Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}
const Input: FC<InputProps> = ({ icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        {icon}
      </div>
    )}
    <input
      {...props}
      className={cn(
        "w-full bg-white/80 border border-gray-300 text-gray-900 text-sm rounded-xl block p-3 shadow-sm",
        "focus:ring-2 focus:ring-brand focus:border-brand/50 transition-all duration-300",
        icon ? "pl-10" : "pl-4"
      )}
    />
  </div>
);

// Main Contact Component
export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    inquiryType: "General Inquiry",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<"success" | "error" | null>(
    null
  );
  const [formMessage, setFormMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);
    setFormMessage("");

    const { error } = await supabase.from("messages").insert({
      full_name: formData.fullName,
      email: formData.email,
      inquiry_type: formData.inquiryType,
      subject: formData.subject,
      message: formData.message,
    });

    setIsSubmitting(false);

    if (error) {
      setFormStatus("error");
      setFormMessage(
        "There was an issue sending your message. Please try again."
      );
      console.error("Supabase error:", error.message);
    } else {
      setFormStatus("success");
      setFormMessage("Thank you! Your message has been sent successfully.");
      setFormData({
        fullName: "",
        email: "",
        inquiryType: "General Inquiry",
        subject: "",
        message: "",
      });
    }
  };

  const contactInfo = [
    { icon: <Mail size={20} />, text: "contact@dhiselink.so" },
    { icon: <Phone size={20} />, text: "+252 63 4XXXXXX" },
    { icon: <MapPin size={20} />, text: "Hargeisa, Somaliland" },
  ];

  const inquiryTypes = [
    "General Inquiry",
    "Partnership",
    "Project Proposal",
    "Technical Support",
    "Press",
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <div className="grid md:grid-cols-2">
          {/* Left Column */}
          <div className="p-8 sm:p-12 bg-gradient-to-br from-brand/5 via-gray-100 to-gray-50 relative">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-brand/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-24 -right-12 w-64 h-64 bg-brand/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Let’s Connect
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Have a question, proposal, or just want to say hello? We’d love
                to hear from you.
              </p>
              <div className="mt-12 space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand shadow-md border">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/80 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-brand focus:border-brand/50 block p-3 shadow-sm transition-all duration-300"
                >
                  {inquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                name="subject"
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-white/80 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-brand focus:border-brand/50 block p-3 shadow-sm transition-all duration-300"
              />

              <div className="flex flex-col items-start gap-4">
                {/* Modern White Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-xl shadow-lg border border-gray-200 
                  bg-white text-brand hover:text-white hover:bg-brand hover:border-brand 
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Status Message */}
                <AnimatePresence>
                  {formMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "flex items-center gap-3 text-sm font-medium p-3 rounded-lg w-full",
                        formStatus === "success"
                          ? "bg-green-100 text-green-800"
                          : "",
                        formStatus === "error" ? "bg-red-100 text-red-800" : ""
                      )}
                    >
                      {formStatus === "success" && <CheckCircle2 size={20} />}
                      {formStatus === "error" && <AlertTriangle size={20} />}
                      <span>{formMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

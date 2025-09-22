
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Home, Users, ChevronDown } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClientComponentClient<{ public: any }>();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Home size={24} />
        <Users size={24} />
        <span>Path: {pathname}</span>
      </div>
      <button
        onClick={() => alert("Test button")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test
      </button>
    </header>
  );
}


"use client";

// File to nest all client side Providers
import { supabase } from "@/lib/initSupabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import Login from "@/Components/Login";
import Navbar from "@/Components/Navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Login>
        <div className="relative flex flex-col h-full">
          <Navbar />
          {children}
        </div>
      </Login>
    </SessionContextProvider>
  );
}

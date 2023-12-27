"use client";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default async function Logout() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error)
    return (
      <div>
        Error logging out. Please make sure you are actually logged out by
        refreshing this page
      </div>
    );
  return router.push("/");
}

"use client";
import { useSession } from "@supabase/auth-helpers-react";

import Breadcrumb from "@/Components/Breadcrumb";

const breadcrumbEntries = [
  {
    title: "Account",
    path: "account",
  },
  {
    title: "Preferences",
    path: "preferences",
  },
];

export default function Preferences() {
  const session = useSession();

  return (
    <div className="h-full bg-slate-50">
      <div className="flex flex-col container mx-auto mt-4">
        <Breadcrumb entries={breadcrumbEntries} />
        <h1 className="mt-2 text-4xl dark:text-white">Your Account</h1>
        <div className="mt-4 w-fit flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <svg
                className=" w-12 h-12 text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div className="ms-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {session?.user?.email}
                </h3>
                <p className="text-sm font-medium text-gray-400">
                  {session?.user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

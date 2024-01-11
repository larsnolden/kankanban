import React, { Suspense } from "react";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <div className="h-full bg-slate-50 pt-4 px-6">{children}</div>
    </Suspense>
  );
}

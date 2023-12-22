import React from "react";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-24">{children}</div>;
}

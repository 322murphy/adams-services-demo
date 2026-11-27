import { Suspense } from "react";
import { OfficeShell } from "@/components/office-shell";

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OfficeShell>{children}</OfficeShell>
    </Suspense>
  );
}

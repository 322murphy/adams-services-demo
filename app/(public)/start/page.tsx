import { Suspense } from "react";
import { StartServiceForm } from "@/components/start-service-form";

export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
        <StartServiceForm />
      </Suspense>
    </div>
  );
}

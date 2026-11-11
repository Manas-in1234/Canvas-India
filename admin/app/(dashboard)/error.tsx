"use client";

import { Button } from "@/components/ui/button";

// Catches any rendering crash inside the dashboard so one bad record shows a
// recoverable message instead of a blank screen.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md space-y-3 py-16 text-center">
      <h2 className="text-lg font-semibold">Something went wrong on this page</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."} Your data is safe. Try again, or reload the page.
      </p>
      <div className="flex justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </div>
  );
}

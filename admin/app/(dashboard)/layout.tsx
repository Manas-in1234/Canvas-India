"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, serverUnavailable, retrySession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A saved session that simply could not be confirmed is not a sign-out:
    // stay here and offer a retry instead of sending the user to sign in again.
    if (!isLoading && !user && !serverUnavailable) {
      router.replace("/login");
    }
  }, [isLoading, user, serverUnavailable, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user && serverUnavailable) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-lg font-semibold">Can&apos;t reach the server</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You&apos;re still signed in. The server didn&apos;t answer just now, which is usually brief.
        </p>
        <Button onClick={retrySession}>Try again</Button>
      </div>
    );
  }

  if (!user) {
    // Redirect effect above will fire; render nothing in the meantime.
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}

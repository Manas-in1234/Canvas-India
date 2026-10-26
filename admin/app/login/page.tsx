"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ScanLine,
  Palette,
  Package,
} from "lucide-react";
import { useAuth, ApiError } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null),
    [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!isLoading && user) router.replace("/");
  }, [isLoading, user, router]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="login-shell">
      <section className="login-story">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas-india-official-logo.webp"
          alt="Canvas India"
          className="login-story-logo"
          width={160}
          height={76}
        />
        <div>
          <div
            className="page-eyebrow"
            style={{ color: "#8cb3df", marginBottom: 20 }}
          >
            THE WORKSPACE BEHIND THE ART
          </div>
          <h1>
            Made with care.
            <br />
            Managed with <em>clarity.</em>
          </h1>
          <p>
            One place for your creative business. From the first custom shape to
            the final print, ready for someone’s home.
          </p>
          <div className="mt-8 flex gap-5 text-[10px] text-[#9ebddd]">
            <span className="flex items-center gap-2">
              <Palette size={14} />
              Design
            </span>
            <span className="flex items-center gap-2">
              <ScanLine size={14} />
              Customize
            </span>
            <span className="flex items-center gap-2">
              <Package size={14} />
              Deliver
            </span>
          </div>
        </div>
        <div className="login-story-footer">
          <ShieldCheck size={14} />
          Canvas India · Studio & operations
        </div>
      </section>
      <section className="login-form-panel">
        <div>
          <div className="page-eyebrow">WELCOME TO YOUR WORKSPACE</div>
          <h2>Sign in to Canvas India</h2>
          <p className="login-description">
            Your products, your studio, your next big idea.
            <br />
            Let’s get back to creating.
          </p>
          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@canvasindia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && (
              <p
                className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="h-11 w-full justify-between px-4"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in to workspace"}
              <ArrowRight size={16} />
            </Button>
          </form>
          <div className="login-security">
            <ShieldCheck size={13} />
            Secure access for the Canvas India team
          </div>
          <a href="https://canvassindia.com" className="login-back">
            <ArrowLeft size={13} />
            Back to Canvas India
          </a>
        </div>
      </section>
    </main>
  );
}

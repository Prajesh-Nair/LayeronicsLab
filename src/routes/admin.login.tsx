import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/site/BrandLogo";
import { adminPageTitle } from "@/lib/brand";
import { useAdmin } from "@/store/admin";
import { adminGetSession, adminLogin } from "@/lib/api/admin.auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: adminPageTitle("Sign in") }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { authed, setAuthed } = useAdmin();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authed) {
      navigate({ to: "/admin" });
      return;
    }
    adminGetSession().then(({ authed: sessionAuthed }) => {
      if (sessionAuthed) {
        setAuthed(true);
        navigate({ to: "/admin" });
      }
    });
  }, [authed, navigate, setAuthed]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await adminLogin({ data: { username: user, password: pass } });
      if (result.ok) {
        setAuthed(true);
        navigate({ to: "/admin" });
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-hero-gradient px-4">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 sm:p-10 shadow-float">
        <Link to="/" className="inline-block mb-8">
          <BrandLogo variant="full" linkToHome={false} />
        </Link>
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage products and orders.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Username</span>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              required
              disabled={submitting}
              className="mt-2 w-full h-12 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
              className="mt-2 w-full h-12 rounded-2xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth disabled:opacity-60"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl font-semibold">
            <Lock className="w-4 h-4" /> {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

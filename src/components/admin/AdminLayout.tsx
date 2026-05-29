import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { BRAND_NAME } from "@/lib/brand";
import { useAdmin } from "@/store/admin";
import { useEffect } from "react";
import { adminGetSession, adminLogout } from "@/lib/api/admin.auth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();
  const { location } = useRouterState();
  const { authed, authChecked, setAuthed, setAuthChecked } = useAdmin();

  useEffect(() => {
    let cancelled = false;

    adminGetSession()
      .then(({ authed: sessionAuthed }) => {
        if (cancelled) return;
        setAuthed(sessionAuthed);
        setAuthChecked(true);
        if (!sessionAuthed) router.navigate({ to: "/admin/login" });
      })
      .catch(() => {
        if (cancelled) return;
        setAuthed(false);
        setAuthChecked(true);
        router.navigate({ to: "/admin/login" });
      });

    return () => {
      cancelled = true;
    };
  }, [router, setAuthed, setAuthChecked]);

  const signOut = async () => {
    try {
      await adminLogout();
    } finally {
      setAuthed(false);
      router.navigate({ to: "/admin/login" });
    }
  };

  if (!authChecked || !authed) return null;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex flex-col bg-background border-r border-border p-5">
        <Link to="/" className="block mb-8">
          <BrandLogo variant="icon" />
        </Link>
        <nav className="space-y-1 flex-1">
          {NAV.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                  active ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>

      <div className="flex flex-col">
        <header className="bg-background border-b border-border px-6 lg:px-10 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="text-sm text-muted-foreground hidden sm:block">{BRAND_NAME} admin</div>
        </header>
        <main className="p-6 lg:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}

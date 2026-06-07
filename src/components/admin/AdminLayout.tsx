import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Tags, Menu } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { BRAND_NAME } from "@/lib/brand";
import { useAdmin } from "@/store/admin";
import { adminGetSession, adminLogout } from "@/lib/api/admin.auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function navLinkClass(active: boolean, compact = false) {
  if (compact) {
    return `shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-smooth whitespace-nowrap ${
      active
        ? "bg-primary text-primary-foreground shadow-card"
        : "bg-[var(--color-surface)] text-muted-foreground hover:text-foreground"
    }`;
  }
  return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
    active
      ? "bg-primary text-primary-foreground shadow-card"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
}

function AdminNav({
  pathname,
  onNavigate,
  compact = false,
}: {
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <>
      {NAV.map((n) => {
        const active = pathname === n.to;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={navLinkClass(active, compact)}
          >
            <n.icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            {n.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();
  const { location } = useRouterState();
  const { authed, authChecked, setAuthed, setAuthChecked } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false);
      router.navigate({ to: "/admin/login" });
    }
  };

  if (!authChecked || !authed) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex flex-col bg-background border-r border-border p-5">
        <Link to="/" className="block mb-8">
          <BrandLogo variant="icon" />
        </Link>
        <nav className="space-y-1 flex-1">
          <AdminNav pathname={location.pathname} />
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>

      <div className="flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background border-b border-border px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden w-10 h-10 shrink-0 grid place-items-center rounded-xl border border-border hover:bg-muted transition-smooth"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate flex-1">{title}</h1>
          <div className="text-sm text-muted-foreground hidden sm:block shrink-0">{BRAND_NAME} admin</div>
        </header>

        <nav
          className="lg:hidden sticky top-[65px] z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-2.5 overflow-x-auto"
          aria-label="Admin sections"
        >
          <div className="flex gap-2 min-w-max">
            <AdminNav pathname={location.pathname} compact />
          </div>
        </nav>

        <main className="p-4 sm:p-6 lg:p-10 flex-1 min-w-0 overflow-x-auto">{children}</main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[min(100vw,280px)] p-0 flex flex-col">
          <SheetHeader className="p-5 border-b border-border text-left">
            <SheetTitle className="sr-only">Admin menu</SheetTitle>
            <Link to="/" onClick={closeMenu} className="inline-block">
              <BrandLogo variant="icon" />
            </Link>
          </SheetHeader>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <AdminNav pathname={location.pathname} onNavigate={closeMenu} />
          </nav>
          <div className="p-4 border-t border-border">
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

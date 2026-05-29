import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export function SiteShell({ children, hideFooter }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <CartDrawer />
    </div>
  );
}
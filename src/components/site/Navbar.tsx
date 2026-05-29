import { ShoppingCart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/site/BrandWordmark";
import { useCart } from "@/store/cart";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6">
      <nav className="mx-auto max-w-[1400px] glass shadow-glass rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3">
        <BrandWordmark />

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <li><a href="#home" className="hover:text-foreground transition-smooth">Home</a></li>
          <li><a href="#categories" className="hover:text-foreground transition-smooth">Shop</a></li>
          <li><a href="#about" className="hover:text-foreground transition-smooth">About</a></li>
          <li><a href="#contact" className="hover:text-foreground transition-smooth">Contact</a></li>
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Toggle theme" className="rounded-full" onClick={toggle}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="rounded-full relative" onClick={open}>
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-4 h-4 px-1 text-[10px] font-bold rounded-full bg-[var(--color-accent-orange)] text-white">
                {count}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}

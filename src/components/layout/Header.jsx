import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { PillNav } from "@/components/ui/PillNav";
import { LogoMark } from "@/components/ui/LogoMark";
import { doctor, nav } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/components/ui/PillNav.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          : "border-transparent bg-background/95"
      )}
    >
      <Container className="flex h-28 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2" aria-label={`${doctor.fullName} — início`}>
          <LogoMark className="h-24 sm:h-[100px]" />
        </a>

        <nav className="hidden lg:flex items-center" aria-label="Navegação principal">
          <PillNav items={nav} />
        </nav>

        <div className="hidden lg:block">
          <WhatsAppCTA size="sm" />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-foreground lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {open && (
        <div id="mobile-nav" className="lg:hidden border-t border-border bg-background">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 px-3">
              <WhatsAppCTA className="w-full" />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

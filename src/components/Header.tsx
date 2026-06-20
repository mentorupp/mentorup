"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import MentorUpLogo from "@/components/MentorUpLogo";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div
        className={cn(
          "container-custom mx-auto flex h-16 items-center justify-between rounded-2xl px-4 transition-all duration-300 lg:px-5",
          scrolled
            ? "border border-zinc-200/80 bg-white/85 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <MentorUpLogo href="/" size="lg" priority />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition",
                isActive(link.href)
                  ? "bg-primary-50 text-primary-700"
                  : "text-zinc-600 hover:text-primary-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-[13px] font-semibold text-zinc-700 transition hover:text-primary-600"
          >
            Entrar
          </Link>
          <Link href="/register" className="btn-primary px-4 py-2 text-[13px]">
            Começar grátis
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-zinc-700 lg:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="container-custom mx-auto mt-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-zinc-700 hover:bg-primary-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-3">
              <Link href="/login" className="btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary">
                Começar grátis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

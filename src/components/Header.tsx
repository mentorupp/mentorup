"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-primary-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="#inicio" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Mentor<span className="text-primary-600">Up</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-surface-800 transition-colors hover:bg-primary-50 hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-surface-800 transition-colors hover:bg-surface-100"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:brightness-110"
          >
            Começar Grátis
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-surface-800 transition-colors hover:bg-surface-100 lg:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-surface-800 transition-colors hover:bg-primary-50 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-3 text-center text-base font-semibold text-surface-800"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-center text-base font-semibold text-white"
            >
              Começar Grátis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

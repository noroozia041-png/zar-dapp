"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { Menu, Wallet, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // جلوگیری از خطای Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // افکت اسکرول برای شفافیت و سایه
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // بستن منوی موبایل با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vault", label: "Vault" },
    { href: "/stake", label: "Stake" },
    { href: "/docs", label: "Docs" },
    { href: "/help", label: "Help" },
  ];

  const primaryConnector = connectors?.[0];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-slate-950/50 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* لوگو */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/40 transition-all duration-300 group-hover:shadow-amber-500/70 group-hover:scale-105">
            {/* لایه داخلی با گرادیان معکوس */}
            <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-tl from-amber-600 via-amber-400 to-yellow-300 opacity-90" />
            {/* لوگوی Z */}
            <span className="relative font-mono text-2xl font-black text-slate-950 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              Z
            </span>
            {/* افکت درخشش */}
            <span className="absolute -inset-1 rounded-2xl bg-amber-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Zar{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Protocol
              </span>
            </span>
            <span className="text-[10px] font-medium text-amber-400/80 tracking-wider uppercase mt-0.5">
              Gold Yield Protocol
            </span>
          </div>
        </Link>

        {/* لینک‌های دسکتاپ */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:text-amber-300"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-transform duration-300 group-hover:scale-x-100" />
              <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-amber-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          {/* دکمه اتصال کیف پول */}
          <button
            onClick={() => primaryConnector && connect({ connector: primaryConnector })}
            disabled={!primaryConnector || isPending}
            className="ml-3 relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/60 hover:from-amber-500/20 hover:to-amber-500/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <Wallet className="h-4 w-4" />
            {!mounted ? (
              "Connect Wallet"
            ) : isConnected ? (
              `${address?.slice(0, 6)}...${address?.slice(-4)}`
            ) : isPending ? (
              "Connecting..."
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>

        {/* دکمه موبایل */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-amber-400 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* منوی موبایل */}
      <div
        ref={menuRef}
        className={`md:hidden fixed inset-x-0 top-[61px] z-40 transform transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="border-t border-amber-500/20 bg-slate-950/95 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col gap-1 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-base text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 transition-all"
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                primaryConnector && connect({ connector: primaryConnector });
                setMobileMenuOpen(false);
              }}
              disabled={!primaryConnector || isPending}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-3 text-base font-semibold text-amber-200 transition-all hover:border-amber-500/60 hover:from-amber-500/20 hover:to-amber-500/10 disabled:opacity-50"
            >
              <Wallet className="h-5 w-5" />
              {!mounted ? (
                "Connect Wallet"
              ) : isConnected ? (
                "Wallet Connected"
              ) : isPending ? (
                "Connecting..."
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
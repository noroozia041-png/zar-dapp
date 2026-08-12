"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  HelpCircle,
  Landmark,
  Lock,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* --------------------------- پس‌زمینه محیطی --------------------------- */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-amber-400/40 animate-float" />
      <div className="absolute top-1/3 right-1/4 h-3 w-3 rounded-full bg-amber-500/30 animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/3 h-2 w-2 rounded-full bg-amber-300/30 animate-float" />
      <div className="absolute top-2/3 right-10 h-2 w-2 rounded-full bg-amber-400/40 animate-float-delayed" />
      <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
    </div>
  );
}

/* --------------------------- کارت شیشه‌ای --------------------------- */
function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-amber-500/30 via-slate-800/50 to-slate-800/30 p-px transition-all duration-300 hover:from-amber-500/50 hover:via-slate-800/60 hover:to-slate-800/40">
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-900/40 bg-slate-900/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300 ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function HelpPage() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description:
        "Click the Connect Wallet button and select your preferred wallet (MetaMask, WalletConnect, etc.).",
      icon: Wallet,
    },
    {
      number: "02",
      title: "Deposit PAXG",
      description:
        "Go to the Vault page, approve PAXG spending, and deposit your PAXG to mint ZAR.",
      icon: Landmark,
    },
    {
      number: "03",
      title: "Stake ZAR",
      description:
        "Navigate to the Stake page, choose a lock duration, and stake your ZAR tokens to start earning rewards.",
      icon: Lock,
    },
    {
      number: "04",
      title: "Claim Rewards",
      description:
        "Regularly claim your PAXG yield and ZAR emissions from the Stake page.",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            How to Use Zar Protocol
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            A step-by-step guide to get started with the protocol.
          </p>
        </div>

        {/* مراحل */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {steps.map((step) => (
            <GlassCard key={step.number} className="p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-mono text-lg font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    {step.number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="h-5 w-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* نکات سریع */}
        <GlassCard className="p-6 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-slate-400">
                Always check your allowance before depositing or staking to avoid extra transactions.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-slate-400">
                Choose the lock duration that fits your risk tolerance. Longer locks give higher rewards
                but bigger penalties if you exit early.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-slate-400">
                Rewards accrue in real-time. You can claim them anytime from the Stake page.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-sm text-slate-400">
                If you encounter any issues, make sure you are on Arbitrum One network (Chain ID 42161).
              </p>
            </div>
          </div>
        </GlassCard>

        {/* لینک به مستندات */}
        <div className="text-center">
          <p className="text-slate-400">
            For more detailed information, visit the{" "}
            <Link href="/docs" className="text-amber-400 hover:text-amber-300 underline">
              Documentation
            </Link>{" "}
            page.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-800/50 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-600">
          © 2025 Zar Protocol. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Database,
  Landmark,
  Shield,
  TrendingUp,
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

/* --------------------------- بخش Accordion --------------------------- */
function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
      >
        <span className="font-medium text-white">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 py-3 bg-slate-950/50 text-sm text-slate-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <BookOpen className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Zar Protocol Documentation
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Everything you need to know about the protocol mechanics, parameters, and tokenomics.
          </p>
        </div>

        <div className="space-y-8">
          {/* معرفی */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="text-slate-400 leading-relaxed">
              Zar Protocol is an institutional-grade, gold-backed yield protocol built on Arbitrum One.
              It allows users to deposit PAXG (Pax Gold) into the vault, which is then deployed to Aave V3
              to generate real yield. Users receive ZAR tokens proportional to their PAXG deposit, and can
              stake these ZAR tokens to earn a share of the PAXG yield and additional ZAR emissions.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                <Database className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Collateral</p>
                  <p className="text-sm text-slate-400">PAXG (Pax Gold) - 1:1 backed by physical gold.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                <Landmark className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Yield Source</p>
                  <p className="text-sm text-slate-400">Aave V3 lending on Arbitrum.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Reward Split</p>
                  <p className="text-sm text-slate-400">80% to stakers, 20% to protocol.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-lg">
                <Shield className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Non-Custodial</p>
                  <p className="text-sm text-slate-400">Users retain control of their assets.</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* مکانیزم اصلی */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Protocol Mechanics</h2>
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">1. Deposit PAXG</h3>
                <p className="text-slate-400">
                  Users deposit PAXG into the ZarVault. The vault mints an equivalent amount of ZAR
                  tokens (1 PAXG = 1 ZAR) and sends them to the user. The PAXG is then supplied to
                  Aave V3 to earn interest.
                </p>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">2. Stake ZAR</h3>
                <p className="text-slate-400">
                  Users can stake their ZAR tokens to earn rewards. Staking ZAR gives them a share
                  of the PAXG yield (80%) and additional ZAR emissions. Users can choose a lock
                  duration to boost their rewards.
                </p>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">3. Claim Rewards</h3>
                <p className="text-slate-400">
                  Stakers can claim two types of rewards:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>PAXG Yield - Real yield from Aave lending.</li>
                    <li>ZAR Emission - Protocol token emissions.</li>
                  </ul>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* پارامترها و جریمه‌ها */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Parameters & Penalties</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Lock Tiers (ZAR Staking)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-3 py-2 text-left text-slate-400">Lock Duration</th>
                        <th className="px-3 py-2 text-left text-slate-400">Multiplier</th>
                        <th className="px-3 py-2 text-left text-slate-400">Early Unstake Penalty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50">
                        <td className="px-3 py-2 text-slate-300">Flexible (0 days)</td>
                        <td className="px-3 py-2 text-amber-400">1.00x</td>
                        <td className="px-3 py-2 text-emerald-400">0%</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="px-3 py-2 text-slate-300">30 days</td>
                        <td className="px-3 py-2 text-amber-400">1.25x</td>
                        <td className="px-3 py-2 text-red-400">10%</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="px-3 py-2 text-slate-300">90 days</td>
                        <td className="px-3 py-2 text-amber-400">1.50x</td>
                        <td className="px-3 py-2 text-red-400">20%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-slate-300">180 days</td>
                        <td className="px-3 py-2 text-amber-400">2.00x</td>
                        <td className="px-3 py-2 text-red-400">30%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  * Penalty applies only if you unstake before the lock period ends. The penalty is
                  deducted from the amount you unstake, and part of it is burned, the rest goes to the protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                  <h4 className="font-semibold text-white">ZAR Emission Rate</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Set by the protocol and read live from the contract. This determines the rate of ZAR
                    minted per PAXG per second.
                  </p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50">
                  <h4 className="font-semibold text-white">Max Vault Cap</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    The total PAXG that can be deposited is capped by the protocol for security.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* سوالات متداول */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <Accordion title="What is ZAR?">
                ZAR is the protocol's native token, minted when users deposit PAXG. It represents a claim
                on the deposited gold and can be staked to earn rewards.
              </Accordion>
              <Accordion title="How do I earn yield?">
                You earn yield by staking ZAR tokens. The yield comes from two sources: PAXG interest
                generated in Aave V3 (80% distributed to stakers) and ZAR token emissions.
              </Accordion>
              <Accordion title="What happens if I unstake early?">
                If you unstake ZAR before your chosen lock period ends, you will incur a penalty
                (10% for 30-day lock, 20% for 90-day, 30% for 180-day). The penalty is deducted from
                your unstaked amount.
              </Accordion>
              <Accordion title="Is the protocol audited?">
                Zar Protocol is built on battle-tested OpenZeppelin contracts and integrates with Aave V3,
                which is one of the most audited DeFi protocols. However, we always recommend doing your own research.
              </Accordion>
              <Accordion title="Where can I see my rewards?">
                You can view your pending rewards on the Stake page. Connect your wallet to see your
                current position and available claims.
              </Accordion>
            </div>
          </GlassCard>
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
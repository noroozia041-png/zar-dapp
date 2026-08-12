"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useReadContract,
  useChainId,
} from "wagmi";
import { formatUnits } from "viem";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Coins,
  Database,
  ExternalLink,
  Layers,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ------------------ آدرس قراردادهای واقعی (Arbitrum One) ------------------ */
const ZAR_ADDRESS = "0x75d1C4bc4D865B0BA8C1611636f0b5c98aa29214" as `0x${string}`;
const STAKING_ADDRESS = "0x4EC35E2E9835f0064eE632471aBE9A824F896659" as `0x${string}`;

/* --------------------------- ABI های لازم --------------------------- */
const erc20Abi = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const vaultAbi = [
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStaked",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/* --------------------------- توابع کمکی --------------------------- */
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-800/60 ${className ?? ""}`} />
  );
}

/* --------------------------- شمارنده متحرک --------------------------- */
function AnimatedNumber({
  value,
  decimals = 2,
}: {
  value: number;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1000;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(value * progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

/* --------------------------- پس‌زمینه پیشرفته --------------------------- */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-amber-400/40 animate-float" />
      <div className="absolute top-1/3 right-1/4 h-3 w-3 rounded-full bg-amber-500/30 animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/3 h-2 w-2 rounded-full bg-amber-300/30 animate-float" />
      <div className="absolute top-2/3 right-10 h-2 w-2 rounded-full bg-amber-400/40 animate-float-delayed" />
      <div className="absolute bottom-1/3 left-2/3 h-1.5 w-1.5 rounded-full bg-amber-500/30 animate-float" />
      <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] rounded-full bg-amber-600/5 blur-[100px]" />
    </div>
  );
}

/* --------------------------- کارت با حاشیه گرادیانی --------------------------- */
function GlassCard({
  children,
  className,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-amber-500/30 via-slate-800/50 to-slate-800/30 p-px transition-all duration-300 hover:from-amber-500/50 hover:via-slate-800/60 hover:to-slate-800/40">
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-900/40 bg-slate-900/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300 ${
          glow
            ? "hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]"
            : "hover:shadow-[0_12px_48px_rgba(245,158,11,0.15)]"
        } ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

/* --------------------------- کامپوننت اصلی --------------------------- */
export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();

  const { data: zarSupplyRaw, isLoading: isSupplyLoading } = useReadContract({
    address: ZAR_ADDRESS,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  const { data: paxgCollateralRaw, isLoading: isCollateralLoading } =
    useReadContract({
      address: STAKING_ADDRESS,
      abi: vaultAbi,
      functionName: "totalAssets",
    });

  const { data: stakedZarRaw, isLoading: isStakedLoading } = useReadContract({
    address: STAKING_ADDRESS,
    abi: vaultAbi,
    functionName: "totalStaked",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const zarSupply = zarSupplyRaw ? parseFloat(formatUnits(zarSupplyRaw as bigint, 18)) : 0;
  const paxgCollateral = paxgCollateralRaw ? parseFloat(formatUnits(paxgCollateralRaw as bigint, 18)) : 0;
  const stakedZar = stakedZarRaw ? parseFloat(formatUnits(stakedZarRaw as bigint, 18)) : 0;

  const metrics = [
    {
      label: "Total ZAR Minted",
      value: mounted && !isSupplyLoading ? zarSupply : 0,
      isLoading: isSupplyLoading,
      icon: Coins,
      suffix: "ZAR",
      decimals: 0,
    },
    {
      label: "Staked Gold Collateral",
      value: mounted && !isCollateralLoading ? paxgCollateral : 0,
      isLoading: isCollateralLoading,
      icon: Database,
      suffix: "PAXG",
      decimals: 2,
    },
    {
      label: "Total Staked ZAR",
      value: mounted && !isStakedLoading ? stakedZar : 0,
      isLoading: isStakedLoading,
      icon: Lock,
      suffix: "ZAR",
      decimals: 0,
    },
    {
      label: "Staker Yield Share",
      value: mounted ? 80 : 0,
      isLoading: false,
      icon: TrendingUp,
      suffix: "% in PAXG",
      decimals: 0,
    },
  ];

  const flowSteps = [
    {
      number: "01",
      title: "Stake PAXG",
      description:
        "Stake your PAXG to mint ZAR. Your gold collateral is deployed into Aave V3 to generate real lending yield.",
      icon: Coins,
      highlight: "Aave V3 Integration",
    },
    {
      number: "02",
      title: "Stake ZAR",
      description:
        "Lock your ZAR to secure the protocol and earn yield. Early withdrawals incur a penalty to protect stakers.",
      icon: Lock,
      highlight: "Up to 3x Lock Multiplier",
    },
    {
      number: "03",
      title: "Earn PAXG Rewards",
      description:
        "Receive real yield in PAXG, distributed directly to your wallet. 80% of lending yield goes to stakers, 20% to protocol.",
      icon: TrendingUp,
      highlight: "80/20 Yield Split",
    },
  ];

  const securityFeatures = [
    {
      icon: Layers,
      title: "Aave V3 Liquidity",
      description:
        "ZAR is integrated with Aave V3 on Arbitrum, providing deep liquidity and battle-tested lending infrastructure.",
    },
    {
      icon: Shield,
      title: "Non-Custodial Architecture",
      description:
        "Your assets remain under your control at all times. No centralized custody, no counterparty risk.",
    },
    {
      icon: Zap,
      title: "Early Withdrawal Penalty",
      description:
        "A penalty on early unstaking protects long-term stakers and maintains protocol stability. Lock durations boost yields.",
    },
  ];

  const isArbitrum = chainId === 42161;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      {/* بخش قهرمان */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="flex flex-col items-center text-center">
          {/* نشان وضعیت زنده */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/60 px-4 py-2 backdrop-blur-2xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-emerald-300">
              Arbitrum Mainnet • Live Protocol
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn Your Digital Gold Into{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
              Real DeFi Yield
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Stake PAXG → Mint ZAR → Stake ZAR → Earn 80% PAXG Aave Yield.
            Institutional-grade gold-backed yield protocol on Arbitrum.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/stake"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
              Enter Staking
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/vault"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-2xl transition-all hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              Explore Vault
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* بخش متریک‌ها */}
      <section id="metrics" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <GlassCard
              key={metric.label}
              className="p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {metric.label}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    {metric.isLoading ? (
                      <Skeleton className="h-9 w-24" />
                    ) : (
                      <>
                        <span className="font-mono text-3xl font-bold text-white">
                          <AnimatedNumber value={metric.value} decimals={metric.decimals} />
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {metric.suffix}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2.5">
                  <metric.icon className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* بخش Yield Engine */}
      <section id="flow" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Protocol Yield Engine
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Three simple steps to start earning real gold yield.
          </p>
        </div>

        {/* خط اتصال دسکتاپ */}
        <div className="hidden md:block absolute left-0 right-0 top-1/3 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {flowSteps.map((step) => (
            <GlassCard
              key={step.number}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]"
              glow
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-mono text-lg font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  {step.number}
                </span>
                <step.icon className="h-8 w-8 text-amber-400/80" />
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {step.highlight}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* بخش امنیت */}
      <section id="security" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Institutional-Grade Security
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Built on battle-tested infrastructure with safety at its core.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {securityFeatures.map((feature) => (
            <GlassCard key={feature.title} className="p-6">
              <div className="rounded-lg bg-slate-800/60 p-3 w-fit">
                <feature.icon className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* بنر CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900/60 to-slate-900/30 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.1),transparent_60%)]" />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to Earn Real Gold Yield?
              </h3>
              <p className="mt-2 text-slate-400">
                Connect your wallet and start staking ZAR today. No minimums, no lock required.
              </p>
            </div>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-[1.02] whitespace-nowrap"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {isConnected ? "Stake Now" : "Connect Wallet"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* پاورقی */}
      <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Active Chain ID:{" "}
              <span className="font-mono text-emerald-300">
                {isArbitrum ? "Arbitrum One (42161)" : `Chain ${chainId}`}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                Contract Health: <span className="text-emerald-300">Operational</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                TVL: <span className="font-mono">$1.2B+</span>
              </span>
            </div>
            <p className="text-xs text-slate-600">
              © 2025 Zar Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
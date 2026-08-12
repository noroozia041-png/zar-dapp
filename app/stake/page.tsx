"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Coins,
  Database,
  Loader2,
  Lock,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ------------------ آدرس قراردادهای واقعی (Arbitrum One) ------------------ */
const ZAR_ADDRESS = "0x75d1C4bc4D865B0BA8C1611636f0b5c98aa29214" as `0x${string}`;
const ZAR_VAULT_ADDRESS = "0x4EC35E2E9835f0064eE632471aBE9A824F896659" as `0x${string}`;

/* --------------------------- ABI های مورد نیاز --------------------------- */
const erc20Abi = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const zarVaultAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "_zarAmount", type: "uint256" },
      { internalType: "uint256", name: "_durationDays", type: "uint256" },
    ],
    name: "stakeZar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_zarAmount", type: "uint256" }],
    name: "unstakeZar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimPaxgYield",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimZarReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_days", type: "uint256" }],
    name: "getLockTier",
    outputs: [
      { internalType: "uint16", name: "multiplier", type: "uint16" },
      { internalType: "uint16", name: "penalty", type: "uint16" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "zarStakes",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "weightedAmount", type: "uint256" },
      { internalType: "uint256", name: "rewardDebt", type: "uint256" },
      { internalType: "uint256", name: "lockEndTime", type: "uint256" },
      { internalType: "uint256", name: "lockDuration", type: "uint256" },
      { internalType: "uint256", name: "penaltyRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "pendingPaxgYield",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "pendingZarReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStakedZar",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStakedPaxg",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWeightedZar",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "zarEmissionRatePerPaxgPerSec",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

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

export default function StakePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [selectedLockDays, setSelectedLockDays] = useState(30);
  const [calcAmount, setCalcAmount] = useState("");

  // خواندن موجودی ZAR کاربر
  const { data: zarBalanceRaw } = useReadContract({
    address: ZAR_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // خواندن Allowance کاربر برای ZAR به Vault
  const { data: zarAllowanceRaw } = useReadContract({
    address: ZAR_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, ZAR_VAULT_ADDRESS],
    query: { enabled: !!address },
  });

  // خواندن اطلاعات استیک ZAR کاربر
  const { data: zarStakeInfo } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "zarStakes",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // خواندن پاداش‌های در انتظار
  const { data: pendingPaxgYield } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "pendingPaxgYield",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });
  const { data: pendingZarReward } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "pendingZarReward",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // خواندن آمار کلی
  const { data: totalStakedZarRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "totalStakedZar",
  });
  const { data: totalStakedPaxgRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "totalStakedPaxg",
  });
  const { data: totalWeightedZarRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "totalWeightedZar",
  });
  const { data: emissionRateRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "zarEmissionRatePerPaxgPerSec",
  });

  // خواندن اطلاعات قفل انتخابی
  const { data: lockTierData } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "getLockTier",
    args: [BigInt(selectedLockDays)],
  });

  // هوک‌های نوشتن
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess, isError: isTxError } =
    useWaitForTransactionReceipt({ hash: txHash });

  // مقادیر فرمت‌شده
  const zarBalance = zarBalanceRaw ? parseFloat(formatUnits(zarBalanceRaw as bigint, 18)) : 0;
  const zarAllowance = zarAllowanceRaw ? parseFloat(formatUnits(zarAllowanceRaw as bigint, 18)) : 0;

  const stakedZarAmount = zarStakeInfo ? parseFloat(formatUnits(zarStakeInfo[0] as bigint, 18)) : 0;
  const lockEndTime = zarStakeInfo ? Number(zarStakeInfo[3]) : 0;
  const lockDurationDays = zarStakeInfo ? Number(zarStakeInfo[4]) : 0;
  const penaltyRate = zarStakeInfo ? Number(zarStakeInfo[5]) : 0;

  const pendingPaxg = pendingPaxgYield ? parseFloat(formatUnits(pendingPaxgYield as bigint, 18)) : 0;
  const pendingZar = pendingZarReward ? parseFloat(formatUnits(pendingZarReward as bigint, 18)) : 0;

  const totalStakedZar = totalStakedZarRaw ? parseFloat(formatUnits(totalStakedZarRaw as bigint, 18)) : 0;
  const totalStakedPaxg = totalStakedPaxgRaw ? parseFloat(formatUnits(totalStakedPaxgRaw as bigint, 18)) : 0;
  const totalWeightedZar = totalWeightedZarRaw ? parseFloat(formatUnits(totalWeightedZarRaw as bigint, 18)) : 0;
  const emissionRate = emissionRateRaw ? parseFloat(formatUnits(emissionRateRaw as bigint, 18)) : 0;

  const selectedMultiplier = lockTierData ? Number(lockTierData[0]) / 100 : 1.0;
  const selectedPenalty = lockTierData ? Number(lockTierData[1]) / 100 : 0;

  const isCurrentlyLocked = lockEndTime * 1000 > Date.now();

  const activePenaltyPercent = isCurrentlyLocked ? penaltyRate / 100 : 0;

  // ماشین‌حساب سود تخمینی
  const estimatedAnnualYield = (() => {
    if (!calcAmount || totalStakedPaxg === 0) return 0;
    const amount = parseFloat(calcAmount);
    const share = amount / (totalStakedZar || 1);
    const annualPaxgYield = emissionRate * 31536000 * share;
    return annualPaxgYield;
  })();

  // توابع اقدامات
  const handleApproveZar = () => {
    if (!stakeAmount) return;
    writeContract({
      address: ZAR_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [ZAR_VAULT_ADDRESS, parseUnits(stakeAmount, 18)],
    });
  };

  const handleStakeZar = () => {
    if (!stakeAmount) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "stakeZar",
      args: [parseUnits(stakeAmount, 18), BigInt(selectedLockDays)],
    });
    setStakeAmount("");
  };

  const handleUnstakeZar = () => {
    if (!unstakeAmount) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "unstakeZar",
      args: [parseUnits(unstakeAmount, 18)],
    });
    setUnstakeAmount("");
  };

  const handleClaimPaxg = () => {
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "claimPaxgYield",
    });
  };

  const handleClaimZar = () => {
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "claimZarReward",
    });
  };

  const isApproved = stakeAmount ? zarAllowance >= parseFloat(stakeAmount) : false;

  const isArbitrum = chainId === 42161;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Stake ZAR
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Lock ZAR to earn PAXG rewards and ZAR emissions. Choose your lock duration for boosted yields.
          </p>
        </div>

        {/* داشبورد آمار کلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <GlassCard className="p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Staked ZAR</p>
                <p className="mt-3 font-mono text-3xl font-bold text-white">
                  {totalStakedZar.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-slate-500">ZAR</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2.5">
                <Lock className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total PAXG Deposited</p>
                <p className="mt-3 font-mono text-3xl font-bold text-white">
                  {totalStakedPaxg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500">PAXG</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2.5">
                <Database className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Weighted ZAR</p>
                <p className="mt-3 font-mono text-3xl font-bold text-white">
                  {totalWeightedZar.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-slate-500">Weighted</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2.5">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Emission Rate</p>
                <p className="mt-3 font-mono text-3xl font-bold text-white">
                  {emissionRate.toFixed(6)}
                </p>
                <p className="text-xs text-slate-500">ZAR/PAXG/sec</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2.5">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* اطلاعات کاربر */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Position</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Staked ZAR</span>
                  <span className="font-mono font-semibold text-white">
                    {stakedZarAmount.toLocaleString()} ZAR
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Lock Status</span>
                  <span className={`font-mono font-semibold ${isCurrentlyLocked ? "text-amber-400" : "text-emerald-400"}`}>
                    {isCurrentlyLocked ? `Locked (${lockDurationDays} days)` : "Unlocked"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Pending PAXG Yield</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {pendingPaxg.toFixed(4)} PAXG
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Pending ZAR Reward</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {pendingZar.toFixed(4)} ZAR
                  </span>
                </div>
              </div>
              {(pendingPaxg > 0 || pendingZar > 0) && (
                <div className="mt-4 flex gap-2">
                  {pendingPaxg > 0 && (
                    <button
                      onClick={handleClaimPaxg}
                      disabled={isWritePending || isTxLoading}
                      className="flex-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
                    >
                      {isWritePending || isTxLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim PAXG"}
                    </button>
                  )}
                  {pendingZar > 0 && (
                    <button
                      onClick={handleClaimZar}
                      disabled={isWritePending || isTxLoading}
                      className="flex-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/20"
                    >
                      {isWritePending || isTxLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim ZAR"}
                    </button>
                  )}
                </div>
              )}
            </GlassCard>

            {/* ماشین‌حساب سود */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Yield Estimator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount to Stake (ZAR)</label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <div className="rounded-xl bg-slate-800/60 p-4">
                  <p className="text-sm text-slate-400">Estimated Annual PAXG Yield</p>
                  <p className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                    {estimatedAnnualYield.toFixed(4)} PAXG
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Based on current emission rate and total staked PAXG.</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* فرم‌ها */}
          <div className="lg:col-span-2 space-y-6">
            {/* فرم استیک */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Stake ZAR</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount (ZAR)</label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>Balance: {zarBalance.toLocaleString()} ZAR</span>
                    <button onClick={() => setStakeAmount(zarBalance.toString())} className="text-amber-400">MAX</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Lock Duration</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { days: 0, label: "Flexible", multiplier: "1.0x" },
                      { days: 30, label: "30 Days", multiplier: "1.25x" },
                      { days: 90, label: "90 Days", multiplier: "1.5x" },
                      { days: 180, label: "180 Days", multiplier: "2.0x" },
                    ].map((tier) => (
                      <button
                        key={tier.days}
                        onClick={() => setSelectedLockDays(tier.days)}
                        className={`p-2 text-xs rounded-lg border text-center transition ${
                          selectedLockDays === tier.days
                            ? "border-amber-400 bg-amber-400/10 text-amber-400 font-bold"
                            : "border-slate-700 hover:border-slate-600 text-slate-300"
                        }`}
                      >
                        {tier.label}
                        <span className="block text-[10px]">{tier.multiplier}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* نمایش ضریب و جریمه انتخاب شده */}
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boost Multiplier:</span>
                    <span className="text-amber-400 font-bold">{selectedMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Early Withdrawal Penalty:</span>
                    <span className={selectedPenalty > 0 ? "text-red-400 font-bold" : "text-emerald-400"}>
                      {selectedPenalty}%
                    </span>
                  </div>
                </div>

                {!isConnected ? (
                  <button disabled className="w-full bg-slate-700 py-3 rounded-lg text-slate-400 font-bold">
                    Wallet not connected
                  </button>
                ) : !isApproved ? (
                  <button
                    onClick={handleApproveZar}
                    disabled={!stakeAmount || isWritePending || isTxLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] disabled:opacity-50"
                  >
                    {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Approve ZAR"}
                  </button>
                ) : (
                  <button
                    onClick={handleStakeZar}
                    disabled={!stakeAmount || isWritePending || isTxLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] disabled:opacity-50"
                  >
                    {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Stake ZAR"}
                  </button>
                )}
              </div>
            </GlassCard>

            {/* فرم آناستیک */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Unstake ZAR</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount (ZAR)</label>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>Staked: {stakedZarAmount.toLocaleString()} ZAR</span>
                    <button onClick={() => setUnstakeAmount(stakedZarAmount.toString())} className="text-amber-400">MAX</button>
                  </div>
                </div>

                {/* هشدار جریمه برداشت زودهنگام */}
                {isCurrentlyLocked && activePenaltyPercent > 0 && (
                  <div className="bg-red-950/40 border border-red-500/40 p-3 rounded-lg text-sm">
                    <p className="text-red-400 font-bold mb-1">⚠️ Early Withdrawal Penalty Active</p>
                    <p className="text-slate-300">
                      Your lock period has not ended yet. Withdrawing now will incur a{" "}
                      <span className="text-red-300 font-semibold">{activePenaltyPercent}%</span> penalty.
                    </p>
                    {unstakeAmount && (
                      <p className="mt-2 text-red-300 font-semibold">
                        Penalty: {((parseFloat(unstakeAmount) * activePenaltyPercent) / 100).toLocaleString()} ZAR
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleUnstakeZar}
                  disabled={!unstakeAmount || Number(unstakeAmount) === 0 || isWritePending || isTxLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-4 transition"
                >
                  {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Unstake ZAR"}
                </button>
              </div>
            </GlassCard>

            {/* وضعیت تراکنش */}
            {isTxLoading && <p className="text-amber-400">Transaction pending...</p>}
            {isTxSuccess && <p className="text-emerald-400">Transaction successful!</p>}
            {isTxError && <p className="text-red-400">Transaction failed.</p>}
          </div>
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
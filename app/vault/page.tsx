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
  Coins,
  Database,
  Loader2,
  Lock,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ------------------ آدرس قراردادهای واقعی (Arbitrum One) ------------------ */
const ZAR_ADDRESS = "0x75d1C4bc4D865B0BA8C1611636f0b5c98aa29214" as `0x${string}`;
const ZAR_VAULT_ADDRESS = "0x4EC35E2E9835f0064eE632471aBE9A824F896659" as `0x${string}`;
const PAXG_ADDRESS = "0x553d3D295e0f695B9228246232eDF400ed3560B5" as `0x${string}`;

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
    inputs: [{ internalType: "uint256", name: "_paxgAmount", type: "uint256" }],
    name: "depositPaxg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_paxgAmount", type: "uint256" }],
    name: "withdrawPaxg",
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
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "paxgStakes",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "depositTime", type: "uint256" },
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
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
    name: "totalStakedPaxg",
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

export default function VaultPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const chainId = useChainId();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // خواندن موجودی PAXG کاربر
  const { data: paxgBalanceRaw } = useReadContract({
    address: PAXG_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // خواندن Allowance کاربر برای PAXG به Vault
  const { data: paxgAllowanceRaw } = useReadContract({
    address: PAXG_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, ZAR_VAULT_ADDRESS],
    query: { enabled: !!address },
  });

  // خواندن اطلاعات سپرده PAXG کاربر
  const { data: paxgStakeInfo } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "paxgStakes",
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

  // خواندن آمار کلی پروتکل
  const { data: totalStakedPaxgRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "totalStakedPaxg",
  });
  const { data: totalStakedZarRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: zarVaultAbi,
    functionName: "totalStakedZar",
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

  // هوک‌های نوشتن
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess, isError: isTxError } =
    useWaitForTransactionReceipt({ hash: txHash });

  // مقادیر فرمت‌شده
  const paxgBalance = paxgBalanceRaw ? parseFloat(formatUnits(paxgBalanceRaw as bigint, 18)) : 0;
  const paxgAllowance = paxgAllowanceRaw ? parseFloat(formatUnits(paxgAllowanceRaw as bigint, 18)) : 0;
  const stakedPaxgAmount = paxgStakeInfo ? parseFloat(formatUnits(paxgStakeInfo[0] as bigint, 18)) : 0;

  const pendingPaxg = pendingPaxgYield ? parseFloat(formatUnits(pendingPaxgYield as bigint, 18)) : 0;
  const pendingZar = pendingZarReward ? parseFloat(formatUnits(pendingZarReward as bigint, 18)) : 0;

  const totalStakedPaxg = totalStakedPaxgRaw ? parseFloat(formatUnits(totalStakedPaxgRaw as bigint, 18)) : 0;
  const totalStakedZar = totalStakedZarRaw ? parseFloat(formatUnits(totalStakedZarRaw as bigint, 18)) : 0;
  const totalWeightedZar = totalWeightedZarRaw ? parseFloat(formatUnits(totalWeightedZarRaw as bigint, 18)) : 0;
  const emissionRate = emissionRateRaw ? parseFloat(formatUnits(emissionRateRaw as bigint, 18)) : 0;

  const isArbitrum = chainId === 42161;
  const isApproved = depositAmount ? paxgAllowance >= parseFloat(depositAmount) : false;

  // توابع اقدامات
  const handleApprovePaxg = () => {
    if (!depositAmount) return;
    writeContract({
      address: PAXG_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [ZAR_VAULT_ADDRESS, parseUnits(depositAmount, 18)],
    });
  };

  const handleDepositPaxg = () => {
    if (!depositAmount) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "depositPaxg",
      args: [parseUnits(depositAmount, 18)],
    });
    setDepositAmount("");
  };

  const handleWithdrawPaxg = () => {
    if (!withdrawAmount) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: zarVaultAbi,
      functionName: "withdrawPaxg",
      args: [parseUnits(withdrawAmount, 18)],
    });
    setWithdrawAmount("");
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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Gold Vault
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Deposit PAXG to mint ZAR and earn real yield from Aave V3.
          </p>
        </div>

        {/* داشبورد آمار کلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <p className="text-sm font-medium text-slate-400">Total ZAR Staked</p>
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
                  <span className="text-sm text-slate-400">Deposited PAXG</span>
                  <span className="font-mono font-semibold text-white">
                    {stakedPaxgAmount.toLocaleString()} PAXG
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

            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Protocol Info</h2>
              <div className="space-y-2 text-sm">
                <p className="text-slate-400">
                  <span className="font-semibold text-white">Collateral:</span> PAXG (Pax Gold)
                </p>
                <p className="text-slate-400">
                  <span className="font-semibold text-white">Yield Source:</span> Aave V3 Arbitrum
                </p>
                <p className="text-slate-400">
                  <span className="font-semibold text-white">Reward Split:</span> 80% to stakers, 20% to protocol
                </p>
              </div>
            </GlassCard>
          </div>

          {/* فرم‌ها */}
          <div className="lg:col-span-2 space-y-6">
            {/* فرم سپرده PAXG */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Deposit PAXG</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount (PAXG)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>Balance: {paxgBalance.toLocaleString()} PAXG</span>
                    <button onClick={() => setDepositAmount(paxgBalance.toString())} className="text-amber-400">MAX</button>
                  </div>
                </div>

                {!isConnected ? (
                  <button disabled className="w-full bg-slate-700 py-3 rounded-lg text-slate-400 font-bold">
                    Wallet not connected
                  </button>
                ) : !isApproved ? (
                  <button
                    onClick={handleApprovePaxg}
                    disabled={!depositAmount || isWritePending || isTxLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] disabled:opacity-50"
                  >
                    {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Approve PAXG"}
                  </button>
                ) : (
                  <button
                    onClick={handleDepositPaxg}
                    disabled={!depositAmount || isWritePending || isTxLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] disabled:opacity-50"
                  >
                    {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Deposit PAXG"}
                  </button>
                )}
              </div>
            </GlassCard>

            {/* فرم برداشت PAXG */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Withdraw PAXG</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount (PAXG)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>Deposited: {stakedPaxgAmount.toLocaleString()} PAXG</span>
                    <button onClick={() => setWithdrawAmount(stakedPaxgAmount.toString())} className="text-amber-400">MAX</button>
                  </div>
                </div>

                <button
                  onClick={handleWithdrawPaxg}
                  disabled={!withdrawAmount || Number(withdrawAmount) === 0 || isWritePending || isTxLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-4 transition"
                >
                  {isWritePending || isTxLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Withdraw PAXG"}
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
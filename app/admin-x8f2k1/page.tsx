"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { Loader2, Shield, Lock, Unlock, Wallet, Coins, Settings, Activity } from "lucide-react";

// آدرس قراردادها (واقعی)
const ZAR_VAULT_ADDRESS = "0x4EC35E2E9835f0064eE632471aBE9A824F896659" as `0x${string}`;

// ABI توابع مدیریتی از ZarVault
const adminAbi = [
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newCap", type: "uint256" }],
    name: "setVaultCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newRate", type: "uint256" }],
    name: "setZarEmissionRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimOwnerFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxVaultCapPaxg",
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
] as const;

export default function AdminPanel() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [newCap, setNewCap] = useState("");
  const [newRate, setNewRate] = useState("");

  // خواندن اطلاعات
  const { data: owner } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "owner",
  });

  const { data: paused } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "paused",
  });

  const { data: maxCapRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "maxVaultCapPaxg",
  });

  const { data: emissionRateRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "zarEmissionRatePerPaxgPerSec",
  });

  const { data: totalPaxgRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "totalStakedPaxg",
  });

  const { data: totalZarRaw } = useReadContract({
    address: ZAR_VAULT_ADDRESS,
    abi: adminAbi,
    functionName: "totalStakedZar",
  });

  const isOwner = isConnected && address?.toLowerCase() === (owner as string)?.toLowerCase();

  const maxCap = maxCapRaw ? parseFloat(formatUnits(maxCapRaw as bigint, 18)) : 0;
  const emissionRate = emissionRateRaw ? parseFloat(formatUnits(emissionRateRaw as bigint, 18)) : 0;
  const totalPaxg = totalPaxgRaw ? parseFloat(formatUnits(totalPaxgRaw as bigint, 18)) : 0;
  const totalZar = totalZarRaw ? parseFloat(formatUnits(totalZarRaw as bigint, 18)) : 0;

  const handleSetCap = () => {
    if (!newCap) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: adminAbi,
      functionName: "setVaultCap",
      args: [parseUnits(newCap, 18)],
    });
    setNewCap("");
  };

  const handleSetRate = () => {
    if (!newRate) return;
    writeContract({
      address: ZAR_VAULT_ADDRESS,
      abi: adminAbi,
      functionName: "setZarEmissionRate",
      args: [parseUnits(newRate, 18)],
    });
    setNewRate("");
  };

  const handlePause = () => {
    writeContract({ address: ZAR_VAULT_ADDRESS, abi: adminAbi, functionName: "pause" });
  };

  const handleUnpause = () => {
    writeContract({ address: ZAR_VAULT_ADDRESS, abi: adminAbi, functionName: "unpause" });
  };

  const handleClaimFee = () => {
    writeContract({ address: ZAR_VAULT_ADDRESS, abi: adminAbi, functionName: "claimOwnerFee" });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <p>Connect your wallet to access admin panel.</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        <Shield className="h-12 w-12 mb-4" />
        <p>Access denied. You are not the owner.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-amber-400 flex items-center gap-2">
          <Shield className="h-8 w-8" /> Admin Panel
        </h1>

        {/* وضعیت پروتکل */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Status</p>
            <p className={`font-bold ${paused ? "text-red-400" : "text-emerald-400"}`}>
              {paused ? "Paused" : "Active"}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Total PAXG</p>
            <p className="font-mono font-bold">{totalPaxg.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Total ZAR Staked</p>
            <p className="font-mono font-bold">{totalZar.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Emission Rate</p>
            <p className="font-mono font-bold">{emissionRate.toFixed(6)}</p>
          </div>
        </div>

        {/* تنظیمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Vault Cap (PAXG)</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
                placeholder={maxCap.toString()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
              <button
                onClick={handleSetCap}
                disabled={isPending || isTxLoading}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50"
              >
                {isPending || isTxLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set"}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Emission Rate (ZAR/PAXG/s)</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder={emissionRate.toString()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
              <button
                onClick={handleSetRate}
                disabled={isPending || isTxLoading}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50"
              >
                {isPending || isTxLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set"}
              </button>
            </div>
          </div>
        </div>

        {/* کنترل‌ها */}
        <div className="flex flex-wrap gap-4">
          {paused ? (
            <button
              onClick={handleUnpause}
              disabled={isPending || isTxLoading}
              className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50"
            >
              <Unlock className="inline h-4 w-4 mr-2" /> Unpause Protocol
            </button>
          ) : (
            <button
              onClick={handlePause}
              disabled={isPending || isTxLoading}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 disabled:opacity-50"
            >
              <Lock className="inline h-4 w-4 mr-2" /> Pause Protocol
            </button>
          )}

          <button
            onClick={handleClaimFee}
            disabled={isPending || isTxLoading}
            className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 disabled:opacity-50"
          >
            <Coins className="inline h-4 w-4 mr-2" /> Claim Owner Fee
          </button>
        </div>

        {/* وضعیت تراکنش */}
        {isTxLoading && <p className="text-amber-400">Transaction pending...</p>}
        {isTxSuccess && <p className="text-emerald-400">Transaction successful!</p>}
      </div>
    </div>
  );
}
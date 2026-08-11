'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatUnits, parseUnits, getAddress } from 'viem';
import { useState } from 'react';

// آدرس‌های رسمی Zar Protocol روی Arbitrum One
const ZAR_TOKEN_ADDRESS = getAddress('0x75d1c414a0a47a531c360c7a016c6838d6a07ba3');
const ZAR_VAULT_ADDRESS = getAddress('0xb59a4bce73ac585fdc6d4d957eb6ab2c240e7a07');
// آدرس رسمی PAX Gold روی شبکه Arbitrum One
const PAXG_TOKEN_ADDRESS = getAddress('0xfeb4dfC9C72791f678232D3de2929ae591eC6160');

const ERC20_ABI = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

const VAULT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
] as const;

export default function Home() {
  const { isConnected, address } = useAccount();
  const [paxgAmount, setPaxgAmount] = useState<string>('1');

  // خواندن Total Supply توکن ZAR
  const { data: totalSupply } = useReadContract({
    address: ZAR_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // ساخت هوک برای واریز به خزانه
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // تعقیب وضعیت تراکنش
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // فرمت کردن Total Supply
  const formattedSupply = totalSupply
    ? parseFloat(formatUnits(totalSupply, 18)).toLocaleString('en-US', { maximumFractionDigits: 2 })
    : '---';

  // -------------------------------------------------------------
  // محاسبات ریاضی شفاف طلا (Gold Math)
  // -------------------------------------------------------------
  const inputPaxg = parseFloat(paxgAmount) || 0;
  
  // ۱ PAXG = ۱ اونس تروا طلای ۲۴ عیار = ۳۱.۱۰۳۵ گرم طلای خالص ۲۴ عیار
  const pureGold24KGrams = inputPaxg * 31.1034768;
  
  // ۱ گرم ۲۴ عیار = ۱.۳۳۳۳ گرم ۱۸ عیار (خلوص ۷۵۰)
  const gold18KGrams = pureGold24KGrams * (24 / 18);
  
  // ۱ ZAR = ۱ گرم طلای ۱۸ عیار
  const estimatedZarMinted = gold18KGrams;

  const handleDeposit = () => {
    if (!paxgAmount || parseFloat(paxgAmount) <= 0) return;
    try {
      writeContract({
        address: ZAR_VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'deposit',
        value: parseUnits(paxgAmount, 18),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Background Subtle Grid & Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-black text-amber-400 text-xl tracking-wider">
                ZP
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent block">
                Zar Protocol
              </span>
              <span className="text-[10px] text-amber-500/80 tracking-widest font-semibold uppercase block">
                Arbitrum Mainnet
              </span>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 relative z-10">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Institutional Grade Gold Collateralization</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100">
            Gold-Backed Decentralized <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">DApp</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Deposit PAX Gold (PAXG) into the verified vault to mint ZAR tokens. 100% transparent math backed by physical gold reserves.
          </p>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Supply</span>
            <div className="text-3xl font-extrabold text-amber-400">{formattedSupply} <span className="text-lg font-normal text-slate-400">ZAR</span></div>
            <p className="text-xs text-slate-500">Live token supply on Arbitrum</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Peg</span>
            <div className="text-2xl font-extrabold text-slate-100">1 ZAR = 1 Gram</div>
            <p className="text-xs text-amber-400/90 font-medium">18 Karat Gold (750 Fine Gold)</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Collateral Asset</span>
            <div className="text-2xl font-extrabold text-slate-100">PAX Gold (PAXG)</div>
            <p className="text-xs text-slate-500">1 PAXG = 1 Troy Ounce (24K)</p>
          </div>
        </div>

        {/* Deposit & Interactive Transparent Calculator */}
        <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Deposit PAXG & Mint ZAR
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
              Vault v1.0
            </span>
          </div>

          <div className="space-y-5">
            {/* Input Box */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>Deposit Amount</span>
                <span>Asset: PAX Gold (PAXG)</span>
              </div>
              <div className="relative rounded-2xl shadow-inner bg-slate-950 border border-slate-800 focus-within:border-amber-500/80 transition">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={paxgAmount}
                  onChange={(e) => setPaxgAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent px-4 py-4 text-slate-100 text-xl font-bold focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                    PAXG
                  </span>
                </div>
              </div>
            </div>

            {/* Transparent Breakdown Card */}
            <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-3 text-xs">
              <div className="text-slate-400 font-semibold border-b border-slate-800/60 pb-2 flex justify-between">
                <span>Transparent Conversion Breakdown</span>
                <span className="text-amber-400">1 PAXG = 41.47 ZAR</span>
              </div>

              <div className="space-y-2 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gold Weight (Troy Ounces):</span>
                  <span>{inputPaxg.toFixed(4)} oz (24K)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pure Gold Weight (24K Grams):</span>
                  <span>{pureGold24KGrams.toFixed(3)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">18K Equivalent Gold Weight:</span>
                  <span className="text-amber-400 font-bold">{gold18KGrams.toFixed(3)} g</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-200">Total ZAR Tokens Minted:</span>
                <span className="font-extrabold text-amber-400 text-base">{estimatedZarMinted.toFixed(2)} ZAR</span>
              </div>
            </div>

            {/* Action Button */}
            {!isConnected ? (
              <div className="text-center pt-2 space-y-3">
                <p className="text-xs text-amber-400/80 font-medium">Connect your Web3 wallet to deposit collateral</p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <button
                onClick={handleDeposit}
                disabled={isPending || isConfirming || !paxgAmount || parseFloat(paxgAmount) <= 0}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-40 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-amber-500/10 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 text-base"
              >
                {isPending && <span>Awaiting Wallet Signature...</span>}
                {isConfirming && <span>Confirming Transaction on Arbitrum...</span>}
                {!isPending && !isConfirming && <span>Deposit PAXG & Mint ZAR</span>}
              </button>
            )}

            {/* Notifications */}
            {isConfirmed && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs text-center font-semibold">
                Transaction Confirmed! ZAR tokens have been minted to your wallet.
              </div>
            )}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs text-center break-words">
                {error.message.slice(0, 120)}...
              </div>
            )}
          </div>
        </div>

        {/* Security & Smart Contracts Audit Links */}
        <div className="max-w-3xl mx-auto bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 text-xs text-slate-400 space-y-3">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider">Smart Contract Transparency</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <a
              href={`https://arbiscan.io/address/${ZAR_TOKEN_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-amber-500/50 transition flex justify-between items-center group"
            >
              <div>
                <span className="block text-slate-500 text-[10px]">ZAR Token Contract</span>
                <span className="text-slate-300 group-hover:text-amber-400 transition">{ZAR_TOKEN_ADDRESS.slice(0, 10)}...{ZAR_TOKEN_ADDRESS.slice(-8)}</span>
              </div>
              <span className="text-amber-500 text-sm">↗</span>
            </a>
            <a
              href={`https://arbiscan.io/address/${ZAR_VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-amber-500/50 transition flex justify-between items-center group"
            >
              <div>
                <span className="block text-slate-500 text-[10px]">ZAR Vault Contract</span>
                <span className="text-slate-300 group-hover:text-amber-400 transition">{ZAR_VAULT_ADDRESS.slice(0, 10)}...{ZAR_VAULT_ADDRESS.slice(-8)}</span>
              </div>
              <span className="text-amber-500 text-sm">↗</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
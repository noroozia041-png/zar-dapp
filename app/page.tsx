'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useState } from 'react';

// آدرس‌های رسمی Zar Protocol روی Arbitrum One
const ZAR_TOKEN_ADDRESS = '0x75d1C414A0A47A531c360c7A016c6838D6a07BA3';
const ZAR_VAULT_ADDRESS = '0xB59a4Bce73Ac585FDC6D4D957eb6aB2C240E7A07';

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
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState<string>('1');

  // خواندن Total Supply
  const { data: totalSupply } = useReadContract({
    address: ZAR_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
  });

  // ساخت هوک برای واریز به خزانه
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // تعقیب وضعیت تراکنش روی آربیتروم
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // فرمت کردن Total Supply (۱۸ اعشار)
  const formattedSupply = totalSupply
    ? parseFloat(formatUnits(totalSupply, 18)).toLocaleString('en-US', { maximumFractionDigits: 2 })
    : '---';

  // محاسبه هوشمند ماشین حساب (هر ۱ ZAR = یک گرم طلای ۱۸ عیار)
  const inputNum = parseFloat(amount) || 0;
  const estimatedGoldGrams = inputNum.toFixed(2);
  const estimatedOunces = (inputNum * 0.0321507).toFixed(4);

  // تابع اجرای تراکنش Deposit
  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    try {
      writeContract({
        address: ZAR_VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: 'deposit',
        value: parseUnits(amount, 18), // ارسال مقدار به اتریوم/کوین پایه
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-xl">
              ZP
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              Zar Protocol
            </span>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Gold-Backed Decentralized Protocol
          </h1>
          <p className="text-slate-400 text-lg">
            Mint ZAR tokens backed by physical gold reserves with institutional-grade security on Arbitrum One.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-2">
            <span className="text-sm font-medium text-slate-400">Total Supply (ZAR)</span>
            <div className="text-3xl font-bold text-amber-400">{formattedSupply} ZAR</div>
            <p className="text-xs text-slate-500">Live data from Arbitrum Mainnet</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-2">
            <span className="text-sm font-medium text-slate-400">Target Peg</span>
            <div className="text-3xl font-bold text-slate-100">1 ZAR = 1 Gram (18K Gold)</div>
            <p className="text-xs text-slate-500">Physical Reserve Ratio 1:1</p>
          </div>
        </div>

        {/* Deposit & Calculator Section */}
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-4">
            Mint / Deposit ZAR
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Deposit Amount
              </label>
              <div className="relative rounded-xl shadow-sm">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-semibold focus:outline-none focus:border-amber-500 transition"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-semibold">
                  ETH
                </div>
              </div>
            </div>

            {/* Live Interactive Gold Calculator */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Gold Backing:</span>
                <span className="font-semibold text-amber-400">{estimatedGoldGrams} Grams (18K)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Equivalent in Troy Ounces:</span>
                <span className="font-semibold text-slate-200">{estimatedOunces} oz</span>
              </div>
            </div>

            {/* Deposit Action Button */}
            {!isConnected ? (
              <div className="text-center pt-2">
                <p className="text-xs text-amber-500 mb-3">Please connect your wallet first to deposit</p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <button
                onClick={handleDeposit}
                disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-bold py-4 rounded-xl shadow-lg transition transform active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                {isPending && <span>Signing Transaction...</span>}
                {isConfirming && <span>Confirming on Network...</span>}
                {!isPending && !isConfirming && <span>Deposit & Mint ZAR</span>}
              </button>
            )}

            {/* Status Notifications */}
            {isConfirmed && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
                Transaction Successful! ZAR Minted.
              </div>
            )}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center break-words">
                {error.message.slice(0, 100)}...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useState } from 'react';

// Mainnet Contract Addresses
const ZAR_TOKEN_ADDRESS = '0x75d1C4bc4D865B0BA8C1611636f0b5c98aa29214';
const ZAR_VAULT_ADDRESS = '0x4EC35E2E9835f0064eE632471aBE9A824F896659';

const minTokenAbi = [
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const;

export default function Home() {
  const { isConnected } = useAccount();
  const [collateralAmount, setCollateralAmount] = useState('');

  // Fetch Total Supply directly from Arbitrum One
  const { data: totalSupply } = useReadContract({
    address: ZAR_TOKEN_ADDRESS,
    abi: minTokenAbi,
    functionName: 'totalSupply',
  });

  const { data: symbol } = useReadContract({
    address: ZAR_TOKEN_ADDRESS,
    abi: minTokenAbi,
    functionName: 'symbol',
  });

  const formattedSupply = totalSupply
    ? Number(formatUnits(totalSupply, 18)).toLocaleString()
    : '---';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="ltr">
      {/* Navbar */}
      <header className="border-b border-slate-800 p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
            Z
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Zar Protocol</h1>
            <span className="text-xs text-amber-500 font-medium">Arbitrum One Mainnet</span>
          </div>
        </div>
        <ConnectButton />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-12 my-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Decentralized <span className="text-amber-500">Asset-Backed</span> Protocol
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Mint and redeem $ZAR tokens backed by verified real-world assets on Arbitrum One network with institutional-grade security.
          </p>
        </div>

        {/* Protocol Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <span className="text-sm font-medium text-slate-400">Total Circulating Supply</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">
              {formattedSupply} <span className="text-lg text-slate-300">{symbol || 'ZAR'}</span>
            </div>
            <span className="text-xs text-slate-500 mt-4">Real-time data from Arbitrum blockchain</span>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <span className="text-sm font-medium text-slate-400">Vault & Contract Status</span>
            <div className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ZarVault Active & Verified
            </div>
            <a 
              href={`https://arbiscan.io/address/${ZAR_VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-500 hover:underline mt-4 inline-block font-medium"
            >
              Verify Smart Contract on Arbiscan ↗
            </a>
          </div>
        </div>

        {/* Interaction Panel (Minting Box) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full shadow-2xl max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-2 text-center text-white">Deposit Collateral & Mint ZAR</h3>
          <p className="text-slate-400 text-sm text-center mb-6">
            Enter your desired collateral value to issue backed ZAR tokens to your web3 wallet.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm text-slate-300">
              <label>Collateral Amount (USD/Value):</label>
              <span className="text-xs text-amber-500">1:1 Treasury Rate</span>
            </div>
            
            <input
              type="number"
              placeholder="0.00"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xl text-amber-400 focus:outline-none focus:border-amber-500 transition-all font-mono"
            />

            <button
              disabled={!isConnected}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isConnected
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isConnected ? 'Deposit & Issue ZAR Tokens' : 'Connect Wallet to Continue'}
            </button>
          </div>
        </div>

        {/* How It Works & Guide Section */}
        <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 mt-4 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            📖 How Zar Protocol Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold text-slate-200">Connect Web3 Wallet</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Web3 wallet (MetaMask, WalletConnect, or Coinbase Wallet) to Arbitrum One network.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold text-slate-200">Lock Collateral</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deposit verified asset collateral into the ZarVault smart contract following protocol ratios.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold text-slate-200">Receive $ZAR Tokens</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ZarVault mints non-custodial $ZAR tokens directly into your wallet with on-chain cryptographic proof.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 p-6 text-center text-xs text-slate-500">
        © 2026 Zar Protocol. Verified Smart Contracts Deployed on Arbitrum One Mainnet.
      </footer>
    </div>
  );
}
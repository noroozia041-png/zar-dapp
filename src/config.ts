import { http, createConfig } from 'wagmi';
import { arbitrum, hardhat, sepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  // شبکه اصلی Arbitrum One در اولویت اول قرار گرفته است
  chains: [arbitrum, hardhat, sepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [arbitrum.id]: http(), // RPC عمومی آربیتروم وان
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
  },
});
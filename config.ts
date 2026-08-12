// zar-dapp/config.ts
import { http, createConfig } from 'wagmi';
import { hardhat, sepolia, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [hardhat, sepolia, mainnet],
  connectors: [
    injected(), // اتصال به کیف‌پول‌هایی مثل MetaMask
  ],
  ssr: true,
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
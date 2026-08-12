"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// شناسه پروژه WalletConnect را از https://cloud.walletconnect.com دریافت کنید
// و در فایل .env.local قرار دهید: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

const config = createConfig({
  chains: [arbitrum],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
    coinbaseWallet(),
  ],
  transports: {
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
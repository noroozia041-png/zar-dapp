import { http, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  // ۱. فعال‌سازی پشتیبانی از SSR در Next.js برای جلوگیری از خطای Hydration
  ssr: true,

  // ۲. تعریف شبکه آربیتروم اصلی (Arbitrum One - Chain ID: 42161)
  chains: [arbitrum],

  // ۳. اتصالات کیف‌پول‌ها (MetaMask و سایر کیف‌پول‌های مرورگر)
  connectors: [
    injected(),
    metaMask(),
  ],

  // ۴. تنظیم اتصالات شبکه (RPC رسمی آربیتروم)
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});
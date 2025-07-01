'use client';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Cosmic DEX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: false, // Disable SSR to prevent indexedDB errors
});

const queryClient = new QueryClient();

// Custom theme for space/galaxy aesthetic
const customTheme = {
  blurs: {
    modalOverlay: 'blur(20px)',
  },
  colors: {
    accentColor: '#6b63ff',
    accentColorForeground: '#ffffff',
    actionButtonBorder: 'rgba(255, 255, 255, 0.1)',
    actionButtonBorderMobile: 'rgba(255, 255, 255, 0.1)',
    actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.05)',
    closeButton: 'rgba(255, 255, 255, 0.6)',
    closeButtonBackground: 'rgba(255, 255, 255, 0.1)',
    connectButtonBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    connectButtonBackgroundError: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    connectButtonInnerBackground: 'rgba(255, 255, 255, 0.05)',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#6b63ff',
    error: '#f5576c',
    generalBorder: 'rgba(255, 255, 255, 0.1)',
    generalBorderDim: 'rgba(255, 255, 255, 0.05)',
    menuItemBackground: 'rgba(255, 255, 255, 0.05)',
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: 'rgba(26, 26, 46, 0.95)',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    modalText: '#ffffff',
    modalTextDim: 'rgba(255, 255, 255, 0.6)',
    modalTextSecondary: 'rgba(255, 255, 255, 0.8)',
    profileAction: 'rgba(255, 255, 255, 0.1)',
    profileActionHover: 'rgba(255, 255, 255, 0.15)',
    profileForeground: 'rgba(255, 255, 255, 0.05)',
    selectedOptionBorder: '#6b63ff',
    standby: '#f093fb',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 0 20px rgba(107, 99, 255, 0.3)',
    dialog: '0 0 30px rgba(107, 99, 255, 0.5)',
    profileDetailsAction: '0 0 20px rgba(107, 99, 255, 0.3)',
    selectedOption: '0 0 20px rgba(107, 99, 255, 0.3)',
    selectedWallet: '0 0 20px rgba(107, 99, 255, 0.3)',
    walletLogo: '0 0 20px rgba(107, 99, 255, 0.3)',
  },
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            ...customTheme,
            colors: {
              ...customTheme.colors,
              downloadBottomCardBackground: 'rgba(255, 255, 255, 0.05)',
              downloadTopCardBackground: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          locale="en-US"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
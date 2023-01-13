import {
    WalletProviderProps,
    WalletProvider,
} from "@solana/wallet-adapter-react";

import {
    getPhantomWallet,
    // getLedgerWallet,
    // getMathWallet,
    getSolflareWallet,
    getSolletWallet,
    // getSolongWallet,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import("@solana/wallet-adapter-react-ui/styles.css");

export const ClientWalletProvider = (props) => {
    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSolflareWallet(),
            // getLedgerWallet(),
            // getSolongWallet(),
            // getMathWallet(),
            getSolletWallet(),
        ],
        []
    );

    return (
        <WalletProvider wallets={wallets} {...props}>
            <WalletModalProvider {...props} />
        </WalletProvider>
    );
};

export default ClientWalletProvider;

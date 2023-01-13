import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
// import { MoralisProvider } from "react-moralis";
import { Provider } from "react-redux";
import sal from "sal.js";
import { ThemeProvider } from "next-themes";
import "../assets/css/bootstrap.min.css";
import "../assets/css/feather.css";
import "../assets/css/modal-video.css";
import "react-toastify/dist/ReactToastify.css";
import "../assets/scss/style.scss";
import dynamic from "next/dynamic";

import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { loadUser } from "../redux/actions/authActions";
import { wrapper, store } from "../redux/store";
import { GetRouteAction, SetRouteAction } from "../redux/actions/routeActions";

// add react notification component css
import "react-notifications-component/dist/theme.css";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const BlackCatsProvider = dynamic(
    () => import("src/contexts/BlackCatsProvider"),
    {
        ssr: false,
    }
);

const MyApp = ({ Component, pageProps }) => {
    // const SeitoProvider = dynamic(() => import('src/contexts/SeitoProvider"').then(r => r.Seitorovider), { ssr: false });

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    const router = useRouter();
    useEffect(() => {
        sal();
        store.dispatch(loadUser());
        store.dispatch(GetRouteAction());
    }, []);

    useEffect(() => {
        sal({ thresold: 0.1, once: true });
    }, [router.asPath]);

    useEffect(() => {
        document.body.className = `${pageProps.className}`;
        if (router.pathname !== "/login" || router.pathname !== "/register") {
            store.dispatch(SetRouteAction(router.pathname));
        }
    });
    return (
        <Provider store={store}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <BlackCatsProvider>
                            <ThemeProvider defaultTheme="dark">
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </BlackCatsProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </Provider>
    );
};

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.shape({
        className: PropTypes.string,
    }),
};

export default wrapper.withRedux(MyApp);

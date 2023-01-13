const path = require("path");

module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "./src/assets/scss")],
    },

    images: {
        domains: ['www.arweave.net', 'cdn3d.iconscout.com'],
    },

    env: {
        NEXT_PUBLIC_STORE_OWNER_ADDRESS:
            process.env.STORE_OWNER_ADDRESS ||
            process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS,
        NEXT_PUBLIC_STORE_ADDRESS: process.env.STORE_ADDRESS,
        NEXT_PUBLIC_BIG_STORE: process.env.REACT_APP_BIG_STORE,
        NEXT_PUBLIC_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,

        NEXT_SPL_TOKEN_MINTS: process.env.SPL_TOKEN_MINTS,
        NEXT_CG_SPL_TOKEN_IDS: process.env.CG_SPL_TOKEN_IDS,
        NEXT_ENABLE_NFT_PACKS: process.env.REACT_APP_ENABLE_NFT_PACKS,
        NEXT_ENABLE_NFT_PACKS_REDEEM: process.env.REACT_APP_ENABLE_NFT_PACKS_REDEEM,
        SERVER_API_URL: process.env.SERVER_API_URL
    },

    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // eslint-disable-next-line no-param-reassign
        config.ignoreWarnings = [
            {
                message:
                    /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
            },
        ];
        return config;
    },
};

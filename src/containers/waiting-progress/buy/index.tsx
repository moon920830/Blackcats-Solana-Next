import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@ui/button";
import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect, useMemo } from "react";

import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta } from 'src/contexts/meta';
import { useConnection } from 'src/contexts/connection';
import { useAuctionsList } from './hook/useAuctionsList';
import { actions } from "@oysterr/common";
import { useTokenList } from 'src/contexts/tokenList';
import { endSale } from './hook/endSale';

import {
    AuctionState,
    formatTokenAmount,
    Identicon,
    MetaplexModal,
    shortenAddress,
    StringPublicKey,
    toPublicKey,
    useConnectionConfig,
    useMint,
    BidStateType,
} from '@oysterr/common';

import {
    AuctionView,
    useArt,
    useAuction,
    useBidsForAuction,
    useCreators,
    useExtendedArt,
    useUserAccounts
} from 'src/hooks_market';

export enum LiveAuctionViewState {
    All = '0',
    Participated = '1',
    Ended = '2',
    Resale = '3',
    Own = '4',
}


// Demo Image
const WaitingArea = ({ space, className, product }) => {

    const [isCong, setIsCong] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
    const { isLoading, pullAuctionPage } = useMeta();
    console.log('ActionView.isLoading', isLoading);

    const { connected } = useWallet();

    const connection = useConnection();
    const wallet = useWallet();
    const { accountByMint } = useUserAccounts();

    // const { auctions, hasResaleAuctions } = useAuctionsList(activeKey);
    // console.log('ActionView.auctions', auctions);

    const id = 'FUFcK8zXNTvbKcquFwEGp7oHJji7R9yKYC1mHhsNTekz';
    const auction = useAuction(id);
    console.log('ActionView.auction', auction);

    const art = useArt(auction?.thumbnail.metadata.pubkey);
    console.log('ActionView.art', art);

    const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
    console.log('ActionView.ref, data', ref, data);

    const creators = useCreators(auction);
    console.log('ActionView.creators', creators);

    let edition = 'Unique';
    console.log('ActionView.edition', edition);

    const nftCount = auction?.items.flat().length;
    console.log('ActionView.nftCount', nftCount);

    const winnerCount = auction?.items.length;
    console.log('ActionView.winnerCount', winnerCount);

    const isOpen =
        auction?.auction.info.bidState.type === BidStateType.OpenEdition;
    console.log('ActionView.isOpen', isOpen);

    const hasDescription = data === undefined || data.description === undefined;
    console.log('ActionView.hasDescription', hasDescription);

    const description = data?.description;
    console.log('ActionView.description', description);

    const attributes = data?.attributes;
    console.log('ActionView.attributes', attributes);

    const tokenInfo = useTokenList()?.subscribedTokens.filter(
        m => m.address == auction?.auction.info.tokenMint,
    )[0];
    console.log('ActionView.tokenInfo', tokenInfo);

    const auctionView = auction as AuctionView

    const bids = useBidsForAuction(auctionView?.auction.pubkey);
    const { prizeTrackingTickets, bidRedemptions } = useMeta();

    const endInstantSale = async () => {
        try {
            const tx = await endSale({
                auctionView,
                connection,
                accountByMint,
                bids,
                bidRedemptions,
                prizeTrackingTickets,
                wallet,
            });
            console.log('ActionView.tx', tx);

        } catch (e) {
            console.error('endAuction', e);
            return;
        }
    };

    useEffect(() => {
        // if (auctions.length <= 0) return;
        // const id = auctions[0].auction.pubkey

        // // 1. read the auction list and look for the NFT auction by means of mint address //
        // // 2. read the auction list and look for the NFT auction by means of mint address //
        // console.log('ActionView.id', id);
        pullAuctionPage(id);
    }, []);

    const buttonHandler = async (e) => {
        console.log('buttonHandler');
        await endInstantSale();
    }

    return (
        <>
            <div
                className={clsx(
                    "waiting-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-12 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                            <div className="rn-pd-content-area">
                                {
                                    !isCong && (
                                        <div className="row justify-content-center text-center">
                                            <div className="col-md-3">
                                                <div className="spin">
                                                    <Spinner
                                                        animation="border"
                                                        role="status"
                                                    />
                                                </div>
                                                <p className="mt-5 mb-5">Processing</p>
                                                <Button
                                                    size="large"
                                                    className=""
                                                    type="button"
                                                    label=""
                                                    onClick={buttonHandler}
                                                    path="#"
                                                    color="primary"
                                                    shape="square"
                                                    fullwidth={false}
                                                >
                                                    Go Home
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    isCong && (
                                        <div className="row justify-content-center text-center">
                                            <div className="col-md-3">
                                                <h2> Congrautlation !!! </h2>
                                                <p className="mb-5">You can check your NFTs here.</p>
                                                <Button
                                                    size="large"
                                                    className=""
                                                    type="button"
                                                    label=""
                                                    onClick={buttonHandler}
                                                    path="#"
                                                    color="primary"
                                                    shape="square"
                                                    fullwidth={false}
                                                >
                                                    Go to List
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                }
                                {/* {product} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

WaitingArea.propTypes = {
    product: PropTypes.shape({
        slug: PropTypes.string.isRequired,
    }),
    type: PropTypes.string.isRequired
};

WaitingArea.defaultProps = {
    space: 1,
};

export default WaitingArea;

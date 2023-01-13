import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@ui/button";
import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { useUserArts } from 'src/hooks_market';
import { useSolPrice } from 'src/contexts/coingecko';
import {
    WinningConfigType,
    AmountRange,
} from '@oysterr/common';
import { MintInfo, MintLayout } from '@solana/spl-token';
import {
    createAuctionManager,
    SafetyDepositDraft,
} from 'src/actions/createAuctionManager';
import { TokenInfo } from '@solana/spl-token-registry';

import {
    MAX_METADATA_LEN,
    WinnerLimit,
    WinnerLimitType,
    toLamports,
    useMint,
    Creator,
    PriceFloor,
    PriceFloorType,
    IPartialCreateAuctionArgs,
    MetadataKey,
    StringPublicKey,
    WRAPPED_SOL_MINT,
    shortenAddress,
    useNativeAccount,
    WalletSigner,
    WhitelistedCreator

} from '@oysterr/common';

import { useStore } from "src/contexts/store";
import { saveAdmin } from "src/actions/saveAdmin";

import { getEmptyMetaState } from "src/contexts/meta/getEmptyMetaState"
import { pullPage } from "@oysterr/common"

import {
    MINIMUM_SAFE_FEE_AUCTION_CREATION,
    QUOTE_MINT,
} from 'src/constants';
import BN from 'bn.js';
import { constants } from '@oysterr/common';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta } from 'src/contexts/meta';
import { useConnection } from 'src/contexts/connection';
import moment from 'moment';
import { useTokenList } from 'src/contexts/tokenList';

export enum AuctionCategory {
    InstantSale,
    Limited,
    Single,
    Open,
    Tiered,
}

enum InstantSaleType {
    Limited,
    Single,
    Open,
}

interface TierDummyEntry {
    safetyDepositBoxIndex: number;
    amount: number;
    winningConfigType: WinningConfigType;
}

interface Tier {
    items: (TierDummyEntry | {})[];
    winningSpots: number[];
}
interface TieredAuctionState {
    items: SafetyDepositDraft[];
    tiers: Tier[];
    participationNFT?: SafetyDepositDraft;
}

export interface AuctionState {
    // Min price required for the item to sell
    reservationPrice: number;

    // listed NFTs
    items: SafetyDepositDraft[];
    participationNFT?: SafetyDepositDraft;
    participationFixedPrice?: number;
    // number of editions for this auction (only applicable to limited edition)
    editions?: number;

    // date time when auction should start UTC+0
    startDate?: Date;

    // suggested date time when auction should end UTC+0
    endDate?: Date;

    //////////////////
    category: AuctionCategory;

    price?: number;
    priceFloor?: number;
    priceTick?: number;

    startSaleTS?: number;
    startListTS?: number;
    endTS?: number;

    auctionDuration?: number;
    auctionDurationType?: 'days' | 'hours' | 'minutes';
    gapTime?: number;
    gapTimeType?: 'days' | 'hours' | 'minutes';
    tickSizeEndingPhase?: number;

    spots?: number;
    tiers?: Array<Tier>;

    winnersCount: number;

    instantSalePrice?: number;
    instantSaleType?: InstantSaleType;

    quoteMintAddress: string;
    quoteMintInfo: MintInfo;
    quoteMintInfoExtended: TokenInfo;
}

// Demo Image
const WaitingArea = ({ space, className, product }) => {
    console.log('WaitingArea.product', product);

    const [isCong, setIsCong] = useState<boolean>(false);

    const connection = useConnection();
    console.log('WaitingArea.connection', connection);

    const wallet = useWallet();
    console.log('WaitingArea.wallet', wallet);

    const { setStoreForOwner } = useStore();

    let { whitelistedCreatorsByCreator, storeIndexer } = useMeta();
    console.log('WaitingArea.whitelistedCreatorsByCreator.storeIndexer', whitelistedCreatorsByCreator, storeIndexer);

    const solPrice = useSolPrice();

    const items = useUserArts();
    const quoteMintAddress = QUOTE_MINT.toBase58();
    const tokenList = useTokenList();
    console.log('tokenList', tokenList);

    const [attributes, setAttributes] = useState<AuctionState>({
        reservationPrice: 0,
        items: [],
        category: AuctionCategory.Open,
        auctionDurationType: 'minutes',
        gapTimeType: 'minutes',
        winnersCount: 1,
        startSaleTS: undefined,
        startListTS: undefined,
        quoteMintAddress: '',
        //@ts-ignore
        quoteMintInfo: undefined,
        //@ts-ignore
        quoteMintInfoExtended: undefined,
    });
    const mint = useMint(QUOTE_MINT);
    const { ZERO } = constants;
    const [auctionObj, setAuctionObj] = useState<
        | {
            vault: StringPublicKey;
            auction: StringPublicKey;
            auctionManager: StringPublicKey;
        }
        | undefined
    >(undefined);
    const [tieredAttributes, setTieredAttributes] = useState<TieredAuctionState>({
        items: [],
        tiers: [],
    });

    const createAuction = async (attr: AuctionState) => {
        let winnerLimit: WinnerLimit;
        const mint = attributes.quoteMintInfo
        if (
            attr.category === AuctionCategory.InstantSale &&
            attr.instantSaleType === InstantSaleType.Open
        ) {
            const { items, instantSalePrice } = attr;

            if (items.length > 0 && items[0].participationConfig) {
                items[0].participationConfig.fixedPrice = new BN(
                    toLamports(instantSalePrice, mint) || 0,
                );
            }

            winnerLimit = new WinnerLimit({
                type: WinnerLimitType.Unlimited,
                usize: ZERO,
            });
        } else if (attr.category === AuctionCategory.InstantSale) {
            const { items, editions } = attr;

            if (items.length > 0) {
                const item = items[0];
                if (!editions) {
                    item.winningConfigType = WinningConfigType.TokenOnlyTransfer;
                }

                item.amountRanges = [
                    new AmountRange({
                        amount: new BN(1),
                        length: new BN(editions || 1),
                    }),
                ];
            }

            winnerLimit = new WinnerLimit({
                type: WinnerLimitType.Capped,
                usize: new BN(editions || 1),
            });
        } else if (attr.category === AuctionCategory.Open) {
            if (
                attr.items.length > 0 &&
                attr.items[0].participationConfig
            ) {
                attr.items[0].participationConfig.fixedPrice = new BN(
                    toLamports(attr.participationFixedPrice, mint) || 0,
                );
            }
            winnerLimit = new WinnerLimit({
                type: WinnerLimitType.Unlimited,
                usize: ZERO,
            });
        } else if (
            attr.category === AuctionCategory.Limited ||
            attr.category === AuctionCategory.Single
        ) {
            if (attr.items.length > 0) {
                const item = attr.items[0];
                if (
                    attr.category == AuctionCategory.Single &&
                    item.masterEdition
                ) {
                    item.winningConfigType = WinningConfigType.TokenOnlyTransfer;
                }
                item.amountRanges = [
                    new AmountRange({
                        amount: new BN(1),
                        length:
                            attr.category === AuctionCategory.Single
                                ? new BN(1)
                                : new BN(attr.editions || 1),
                    }),
                ];
            }
            winnerLimit = new WinnerLimit({
                type: WinnerLimitType.Capped,
                usize:
                    attr.category === AuctionCategory.Single
                        ? new BN(1)
                        : new BN(attr.editions || 1),
            });

            if (
                attr.participationNFT &&
                attr.participationNFT.participationConfig
            ) {
                attr.participationNFT.participationConfig.fixedPrice = new BN(
                    toLamports(attr.participationFixedPrice, mint) || 0,
                );
            }
        } else {
            const tiers = tieredAttributes.tiers;
            tiers.forEach(
                c =>
                (c.items = c.items.filter(
                    i => (i as TierDummyEntry).winningConfigType !== undefined,
                )),
            );
            const filteredTiers = tiers.filter(
                i => i.items.length > 0 && i.winningSpots.length > 0,
            );

            tieredAttributes.items.forEach((config, index) => {
                let ranges: AmountRange[] = [];
                filteredTiers.forEach(tier => {
                    const tierRangeLookup: Record<number, AmountRange> = {};
                    const tierRanges: AmountRange[] = [];
                    const item = tier.items.find(
                        i => (i as TierDummyEntry).safetyDepositBoxIndex == index,
                    );

                    if (item) {
                        config.winningConfigType = (
                            item as TierDummyEntry
                        ).winningConfigType;
                        const sorted = tier.winningSpots.sort();
                        sorted.forEach((spot, i) => {
                            if (tierRangeLookup[spot - 1]) {
                                tierRangeLookup[spot] = tierRangeLookup[spot - 1];
                                tierRangeLookup[spot].length = tierRangeLookup[spot].length.add(
                                    new BN(1),
                                );
                            } else {
                                tierRangeLookup[spot] = new AmountRange({
                                    amount: new BN((item as TierDummyEntry).amount),
                                    length: new BN(1),
                                });
                                // If the first spot with anything is winner spot 1, you want a section of 0 covering winning
                                // spot 0.
                                // If we have a gap, we want a gap area covered with zeroes.
                                const zeroLength = i - 1 > 0 ? spot - sorted[i - 1] - 1 : spot;
                                if (zeroLength > 0) {
                                    tierRanges.push(
                                        new AmountRange({
                                            amount: new BN(0),
                                            length: new BN(zeroLength),
                                        }),
                                    );
                                }
                                tierRanges.push(tierRangeLookup[spot]);
                            }
                        });
                        // Ok now we have combined ranges from this tier range. Now we merge them into the ranges
                        // at the top level.
                        const oldRanges = ranges;
                        ranges = [];
                        let oldRangeCtr = 0,
                            tierRangeCtr = 0;

                        while (
                            oldRangeCtr < oldRanges.length ||
                            tierRangeCtr < tierRanges.length
                        ) {
                            let toAdd = new BN(0);
                            if (
                                tierRangeCtr < tierRanges.length &&
                                tierRanges[tierRangeCtr].amount.gt(new BN(0))
                            ) {
                                toAdd = tierRanges[tierRangeCtr].amount;
                            }

                            if (oldRangeCtr == oldRanges.length) {
                                ranges.push(
                                    new AmountRange({
                                        amount: toAdd,
                                        length: tierRanges[tierRangeCtr].length,
                                    }),
                                );
                                tierRangeCtr++;
                            } else if (tierRangeCtr == tierRanges.length) {
                                ranges.push(oldRanges[oldRangeCtr]);
                                oldRangeCtr++;
                            } else if (
                                oldRanges[oldRangeCtr].length.gt(
                                    tierRanges[tierRangeCtr].length,
                                )
                            ) {
                                oldRanges[oldRangeCtr].length = oldRanges[
                                    oldRangeCtr
                                ].length.sub(tierRanges[tierRangeCtr].length);

                                ranges.push(
                                    new AmountRange({
                                        amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                                        length: tierRanges[tierRangeCtr].length,
                                    }),
                                );

                                tierRangeCtr += 1;
                                // dont increment oldRangeCtr since i still have length to give
                            } else if (
                                tierRanges[tierRangeCtr].length.gt(
                                    oldRanges[oldRangeCtr].length,
                                )
                            ) {
                                tierRanges[tierRangeCtr].length = tierRanges[
                                    tierRangeCtr
                                ].length.sub(oldRanges[oldRangeCtr].length);

                                ranges.push(
                                    new AmountRange({
                                        amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                                        length: oldRanges[oldRangeCtr].length,
                                    }),
                                );

                                oldRangeCtr += 1;
                                // dont increment tierRangeCtr since they still have length to give
                            } else if (
                                tierRanges[tierRangeCtr].length.eq(
                                    oldRanges[oldRangeCtr].length,
                                )
                            ) {
                                ranges.push(
                                    new AmountRange({
                                        amount: oldRanges[oldRangeCtr].amount.add(toAdd),
                                        length: oldRanges[oldRangeCtr].length,
                                    }),
                                );
                                // Move them both in this degen case
                                oldRangeCtr++;
                                tierRangeCtr++;
                            }
                        }
                    }
                });
                console.log('Ranges');
                config.amountRanges = ranges;
            });

            winnerLimit = new WinnerLimit({
                type: WinnerLimitType.Capped,
                usize: new BN(attr.winnersCount),
            });
            if (
                attr.participationNFT &&
                attr.participationNFT.participationConfig
            ) {
                attr.participationNFT.participationConfig.fixedPrice = new BN(
                    toLamports(attr.participationFixedPrice, mint) || 0,
                );
            }
            console.log('Tiered settings', tieredAttributes.items);
        }

        const isInstantSale =
            attr.instantSalePrice &&
            attr.priceFloor === attr.instantSalePrice;

        const LAMPORTS_PER_TOKEN =
            attr.quoteMintAddress == WRAPPED_SOL_MINT.toBase58()
                ? LAMPORTS_PER_SOL
                : Math.pow(10, attr.quoteMintInfo.decimals || 0);

        const auctionSettings: IPartialCreateAuctionArgs = {
            winners: winnerLimit,
            endAuctionAt: isInstantSale
                ? null
                : new BN(
                    (attr.auctionDuration || 0) *
                    (attr.auctionDurationType == 'days'
                        ? 60 * 60 * 24 // 1 day in seconds
                        : attr.auctionDurationType == 'hours'
                            ? 60 * 60 // 1 hour in seconds
                            : 60), // 1 minute in seconds
                ), // endAuctionAt is actually auction duration, poorly named, in seconds
            auctionGap: isInstantSale
                ? null
                : new BN(
                    (attr.gapTime || 0) *
                    (attr.gapTimeType == 'days'
                        ? 60 * 60 * 24 // 1 day in seconds
                        : attr.gapTimeType == 'hours'
                            ? 60 * 60 // 1 hour in seconds
                            : 60), // 1 minute in seconds
                ),
            priceFloor: new PriceFloor({
                type: attr.priceFloor
                    ? PriceFloorType.Minimum
                    : PriceFloorType.None,
                minPrice: new BN((attr.priceFloor || 0) * LAMPORTS_PER_TOKEN),
            }),
            tokenMint: attr.quoteMintAddress,
            gapTickSizePercentage: attr.tickSizeEndingPhase || null,
            tickSize: attr.priceTick
                ? new BN(attr.priceTick * LAMPORTS_PER_TOKEN)
                : null,
            instantSalePrice: attr.instantSalePrice
                ? new BN((attr.instantSalePrice || 0) * LAMPORTS_PER_TOKEN)
                : null,
            name: null,
        };

        const isOpenEdition =
            attr.category === AuctionCategory.Open ||
            attr.instantSaleType === InstantSaleType.Open;

        const safetyDepositDrafts = isOpenEdition
            ? []
            : attr.category !== AuctionCategory.Tiered
                ? attr.items
                : tieredAttributes.items;
        const participationSafetyDepositDraft = isOpenEdition
            ? attr.items[0]
            : attr.participationNFT;

        const _auctionObj = await createAuctionManager(
            connection,
            wallet as WalletSigner,
            whitelistedCreatorsByCreator,
            auctionSettings,
            safetyDepositDrafts,
            participationSafetyDepositDraft,
            attr.quoteMintAddress,
            storeIndexer,
        );

        console.log('createAuction.createAuctionManager', _auctionObj);
        setAuctionObj(_auctionObj);

        // update the ui component //
        if (_auctionObj) setIsCong(true);
    };

    const sellProgress = async (meta) => {
        // 1. seito: fetch the metadata of nft //
        const meta_nft_pubKey = meta.account;
        const meta_nft_sol_price = parseFloat(meta.price) / solPrice;
        console.log('sellButtonHandler.useUserArts', meta);

        // 2. seito: set the category //
        let attr = attributes;
        attr = {
            ...attr,
            category: AuctionCategory.InstantSale
        }

        // 3. seito: select the nft item //
        console.log('sellButtonHandler.useUserArts', items);

        const selected = items.filter(item =>
            item.metadata.info.mint == meta_nft_pubKey
        );
        attr = {
            ...attr,
            items: selected,
            instantSaleType: InstantSaleType.Limited,
            priceFloor: parseFloat('' + meta_nft_sol_price),
            instantSalePrice: parseFloat('' + meta_nft_sol_price),
        }

        attr.quoteMintAddress = quoteMintAddress;
        if (attr.quoteMintAddress) {
            attr.quoteMintInfo = mint!;
            attr.quoteMintInfoExtended = tokenList.tokenMap.get(
                attr.quoteMintAddress,
            )!;
        }

        // 4. seito: go to the review //
        attr = {
            ...attr,
            startListTS: attr.startListTS || moment().unix(),
            startSaleTS: attr.startSaleTS || moment().unix(),
        }

        // 5. seito: create the whitelistedCreator //
        // await saveAdmin(connection, wallet as WalletSigner, false, [
        //     new WhitelistedCreator({
        //         address: wallet.publicKey?.toBase58() || '',
        //         activated: true,
        //     }),
        // ]);
        // await setStoreForOwner(wallet.publicKey?.toBase58());

        // let nextState = await pullPage(
        //     connection,
        //     0,
        //     getEmptyMetaState(),
        //     wallet?.publicKey,
        //     false,
        // );
        // console.log('sellButtonHandler.getEmptyMetaState.nextState', nextState);
        // whitelistedCreatorsByCreator = nextState.whitelistedCreatorsByCreator;
        // storeIndexer = nextState.storeIndexer;

        // 6. seito: create the createAction //
        console.log('sellButtonHandler.whitelistedCreatorsByCreator.storeIndexer', whitelistedCreatorsByCreator, storeIndexer);
        console.log('sellButtonHandler.attributes', attr);
        const tx = await createAuction(attr);

        // 7. seito: call the backend api to save the result, and then go to on sale tag //

        // 8. seito: update the state //
        setAttributes(attr);

        return tx;
    }

    useEffect(() => {
        console.log('useEffect.wallet', wallet);
        console.log('useEffect.connection', connection);
        // console.log('useEffect.endpoint', endpoint);

        const sellNFT = async () => {
            try {
                // call the api to fetch the metadata //
                let payload = { nft_id: product }
                let config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                let response = await axios.post("/api/nft/getmeta", payload, config);
                let result = response.data.result;
                console.log("useEffect.getmeta.result", result);

                // do the selling transaction //
                let transaction = await sellProgress(result);

                // call the api to store the result //
                payload = { nft_id: product }
                response = await axios.post("/api/nft/savetransaction", payload, config);
                result = response.data.result;
                console.log("useEffect.savetransaction.result", result);

            } catch (error: any) {
                console.log("useEffect.error", error);
            }
        }

        // const sellNFT = async () => {
        //     await setStoreForOwner(wallet.publicKey?.toBase58());

        //     let nextState = await pullPage(
        //         connection,
        //         0,
        //         getEmptyMetaState(),
        //         wallet?.publicKey,
        //         false,
        //     );
        //     console.log('useEffect.pullPage.nextState', nextState);
        //     whitelistedCreatorsByCreator = nextState.whitelistedCreatorsByCreator;
        //     storeIndexer = nextState.storeIndexer;

        //     await sellProgress()
        // };

        // create the store //
        // sellNFT();
    }, []);

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
                                                    onClick={(e) => { }}
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
                                                    onClick={(e) => { }}
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

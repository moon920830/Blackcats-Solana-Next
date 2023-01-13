import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useConnection } from '../connection';
import { useStore } from '../store';
import {
  useUserAccounts
} from 'src/hooks_market'

import { queryExtendedMetadata } from './queryExtendedMetadata';
import { getEmptyMetaState } from './getEmptyMetaState';
import {
  limitedLoadAccounts,
  loadAccounts,
  pullAuctionData,
  pullYourMetadata,
  USE_SPEED_RUN,
} from '@oysterr/common';
import { MetaContextState, MetaState } from './types';

import { AuctionData, BidderMetadata, BidderPot } from '@oysterr/common';
import {
  pullAuctionSubaccounts,
  pullPage,
  pullPayoutTickets,
  pullStoreMetadata,
  pullPacks,
  pullPack,
} from '@oysterr/common';
import { StringPublicKey, TokenAccount } from '@oysterr/common';


const MetaContext = React.createContext<MetaContextState>({
  ...getEmptyMetaState(),
  isLoading: false,
  isFetching: false,
  // @ts-ignore
  update: () => [AuctionData, BidderMetadata, BidderPot],
});

export function MetaProvider({
  children = null,
}: {
  children: React.ReactNode;
}) {
  const connection = useConnection();
  const { isReady, storeAddress, setStoreForOwner } = useStore();
  const wallet = useWallet();
  console.log('MetaProvider.connection', connection);
  console.log('MetaProvider.wallet', wallet.publicKey?.toBase58());
  console.log('MetaProvider.storeAddress', storeAddress);

  const [state, setState] = useState<MetaState>(getEmptyMetaState());
  const [page, setPage] = useState(0);
  const [
    _lastLength,
    setLastLength,
  ] = useState(0);
  const { userAccounts } = useUserAccounts();
  console.log('MetaProvider.userAccounts', userAccounts);

  const [isLoading, setIsLoading] = useState(false);
  const updateRequestsInQueue = useRef(0);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const loadedMetadataLength = useRef(0);

  const updateMints = useCallback(
    async metadataByMint => {
      try {
        const { metadata, mintToMetadata } = await queryExtendedMetadata(
          connection,
          metadataByMint,
        );

        console.log('meta.updateMints.queryExtendedMetadata.metadataByMint.metadata.mintToMetadata', metadataByMint, metadata, mintToMetadata);
        setState(current => ({
          ...current,
          metadata,
          metadataByMint: mintToMetadata,
        }));
      } catch (er) {
        console.error(er);
      }
    },
    [setState],
  );

  async function pullAllMetadata() {
    console.log('meta.pullAllMetadata.isLoading.storeAddress.isReady.state.store', isLoading, storeAddress, isReady, state);

    // return if isloading is true, meaning that already loaded before
    if (isLoading) return false;

    // if not loaded, and there is no storeAddress
    if (!storeAddress) {
      if (isReady) {
        setIsLoading(false);
      }
      return;
    } else if (!state.store) {
      setIsLoading(true);
    }
    setIsLoading(true);

    const nextState = await pullStoreMetadata(connection, state);
    console.log('meta.pullAllMetadata.pullStoreMetadata.state.nextState', state, nextState)

    setIsLoading(false);
    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return [];
  }

  async function pullBillingPage(auctionAddress: StringPublicKey) {
    console.log('meta.pullBillingPage.isLoading.storeAddress.isReady.state.store', isLoading, storeAddress, isReady, state);

    if (isLoading) return false;
    if (!storeAddress) {
      if (isReady) {
        setIsLoading(false);
      }
      return;
    } else if (!state.store) {
      setIsLoading(true);
    }
    const nextState = await pullAuctionSubaccounts(
      connection,
      auctionAddress,
      state,
    );
    console.log('meta.pullBillingPage.pullAuctionSubaccounts.auctionAddress,state.nextState', auctionAddress, state, nextState);

    console.log('-----> Pulling all payout tickets');
    await pullPayoutTickets(connection, nextState);

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return [];
  }

  async function pullAuctionListData(auctionAddress: StringPublicKey) {
    const nextState = await pullAuctionData(connection, auctionAddress, state);
    console.log('meta.pullAuctionListData.auctionAddress,state.nextState', auctionAddress, state, nextState);

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return nextState;
  }

  async function pullAuctionPage(auctionAddress: StringPublicKey) {
    console.log('meta.pullAuctionPage.isLoading.storeAddress.isReady.state.store', isLoading, storeAddress, isReady, state);

    if (isLoading) return state;
    if (!storeAddress) {
      if (isReady) {
        setIsLoading(false);
      }
      return state;
    } else if (!state.store) {
      setIsLoading(true);
    }
    const nextState = await pullAuctionSubaccounts(
      connection,
      auctionAddress,
      state,
    );
    console.log('meta.pullAuctionPage.pullAuctionSubaccounts.auctionAddress,state.nextState', auctionAddress, state, nextState);

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return nextState;
  }

  async function pullItemsPage(
    userTokenAccounts: TokenAccount[],
  ): Promise<void> {
    if (isFetching) {
      return;
    }

    const shouldEnableNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';
    const packsState = shouldEnableNftPacks
      ? await pullPacks(connection, state, wallet?.publicKey)
      : state;

    await pullUserMetadata(userTokenAccounts, packsState);
    console.log('meta.pullItemsPage.packsState.userTokenAccounts', packsState, userTokenAccounts);
  }

  async function pullPackPage(
    userTokenAccounts: TokenAccount[],
    packSetKey: StringPublicKey,
  ): Promise<void> {
    if (isFetching) {
      return;
    }

    const packState = await pullPack({
      connection,
      state,
      packSetKey,
      walletKey: wallet?.publicKey,
    });

    console.log('meta.pullPackPage.packState', packState, userTokenAccounts);

    await pullUserMetadata(userTokenAccounts, packState);
  }

  async function pullUserMetadata(
    userTokenAccounts: TokenAccount[],
    tempState?: MetaState,
  ): Promise<void> {
    console.log('meta.pullUserMetadata.userTokenAccounts.state,tempState', userTokenAccounts, state, tempState);

    setIsLoadingMetadata(true);
    loadedMetadataLength.current = userTokenAccounts.length;
    console.log('meta.pullUserMetadata.loadedMetadataLength.current', loadedMetadataLength.current);

    const nextState = await pullYourMetadata(
      connection,
      userTokenAccounts,
      tempState || state,
    );
    console.log('meta.pullUserMetadata.pullYourMetadata.state.nextState', state, nextState);

    await updateMints(nextState.metadataByMint);

    setState(nextState);
    setIsLoadingMetadata(false);
  }

  async function pullAllSiteData() {
    console.log('meta.pullAllSiteData.isLoading.storeAddress.isReady.state', isLoading, storeAddress, isReady, state);

    if (isLoading) return state;
    if (!storeAddress) {
      if (isReady) {
        setIsLoading(false);
      }
      return state;
    } else if (!state.store) {
      setIsLoading(true);
    }
    console.log('------->Query started');

    const nextState = await loadAccounts(connection);
    console.log('meta.pullAllSiteData.nextState', nextState);

    console.log('------->Query finished');

    setState(nextState);
    await updateMints(nextState.metadataByMint);
    return;
  }

  async function update(auctionAddress?: any, bidderAddress?: any) {
    console.log('meta.update.isLoading.storeAddress.isReady.state', isLoading, storeAddress, isReady, Object.assign({}, state));
    console.log('meta.update.auctionAddress.bidderAddress', auctionAddress, bidderAddress);

    await setStoreForOwner(wallet.publicKey?.toBase58());

    if (!storeAddress) {
      if (isReady) {
        //@ts-ignore
        window.loadingData = false;
        setIsLoading(false);
      }
      return;
    } else if (!state.store) {
      //@ts-ignore
      window.loadingData = true;
      setIsLoading(true);
    }

    const shouldFetchNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';
    console.log('meta.update.shouldFetchNftPacks', shouldFetchNftPacks);

    let nextState = await pullPage(
      connection,
      page,
      state,
      wallet?.publicKey,
      shouldFetchNftPacks,
    );
    console.log('meta.update.pullPage.page.nextState', page, nextState);
    console.log('meta.update.-----> Query started');

    if (nextState.storeIndexer.length) {
      if (USE_SPEED_RUN) {
        nextState = await limitedLoadAccounts(connection);
        console.log('meta.update.limitedLoadAccounts', nextState);

        console.log('meta.update.------->Query finished');

        setState(nextState);

        //@ts-ignore
        window.loadingData = false;
        setIsLoading(false);
      }
      else {
        console.log('meta.update.------->Pagination detected, pulling page', page);

        const auction = window.location.href.match(/#\/auction\/(\w+)/);
        const billing = window.location.href.match(
          /#\/auction\/(\w+)\/billing/,
        );
        if (auction && page == 0) {
          console.log(
            'meta.update.---------->Loading auction page on initial load, pulling sub accounts',
          );

          nextState = await pullAuctionSubaccounts(
            connection,
            auction[1],
            nextState,
          );
          console.log('meta.update.pullAuctionSubaccounts', nextState);

          if (billing) {
            console.log('-----> Pulling all payout tickets');
            await pullPayoutTickets(connection, nextState);
          }
        }

        let currLastLength;
        setLastLength(last => {
          currLastLength = last;
          return last;
        });
        if (nextState.storeIndexer.length != currLastLength) {
          setPage(page => page + 1);
        }
        setLastLength(nextState.storeIndexer.length);

        //@ts-ignore
        window.loadingData = false;
        setIsLoading(false);
        setState(nextState);
      }
    }
    else {
      console.log('meta.update.------->No pagination detected');
      nextState = !USE_SPEED_RUN
        ? await loadAccounts(connection)
        : await limitedLoadAccounts(connection);

      console.log('meta.update.USE_SPEED_RUN.nextState', USE_SPEED_RUN, nextState);
      console.log('meta.update.------->Query finished');

      setState(nextState);

      //@ts-ignore
      window.loadingData = false;
      setIsLoading(false);
    }

    console.log('meta.update.------->set finished');

    if (auctionAddress && bidderAddress) {
      nextState = await pullAuctionSubaccounts(
        connection,
        auctionAddress,
        nextState,
      );
      console.log('meta.update.pullAuctionSubaccounts.nextState', nextState);

      setState(nextState);

      const auctionBidderKey = auctionAddress + '-' + bidderAddress;
      return [
        nextState.auctions[auctionAddress],
        nextState.bidderPotsByAuctionAndBidder[auctionBidderKey],
        nextState.bidderMetadataByAuctionAndBidder[auctionBidderKey],
      ];
    }
  }

  // useEffect(() => {
  //   //@ts-ignore
  //   if (window.loadingData) {
  //     console.log('meta.useEffect.currently another update is running, so queue for 3s...');
  //     updateRequestsInQueue.current += 1;
  //     const interval = setInterval(() => {
  //       //@ts-ignore
  //       if (window.loadingData) {
  //         console.log('meta.useEffect.not running queued update right now, still loading');
  //       } else {
  //         console.log('meta.useEffect.running queued update');
  //         update(undefined, undefined);
  //         updateRequestsInQueue.current -= 1;
  //         clearInterval(interval);
  //       }
  //     }, 3000);
  //   } else {
  //     console.log('meta.useEffect.no update is running, updating.');
  //     update(undefined, undefined);
  //     updateRequestsInQueue.current = 0;
  //   }
  // }, [connection, setState, updateMints, storeAddress, isReady, page]);

  // Fetch metadata on userAccounts change
  useEffect(() => {
    const shouldFetch =
      !isLoading &&
      !isLoadingMetadata &&
      loadedMetadataLength.current !== userAccounts.length;

    if (shouldFetch) {
      pullUserMetadata(userAccounts);
    }
  }, [
    isLoading,
    isLoadingMetadata,
    loadedMetadataLength.current,
    userAccounts.length,
  ]);

  const isFetching = isLoading || updateRequestsInQueue.current > 0;

  return (
    <MetaContext.Provider
      value={{
        ...state,
        // @ts-ignore
        update,
        pullAuctionPage,
        pullAllMetadata,
        pullBillingPage,
        // @ts-ignore
        pullAllSiteData,
        pullItemsPage,
        pullPackPage,
        pullUserMetadata,
        pullAuctionListData,
        isLoading,
        isFetching,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
}

export const useMeta = () => {
  const context = useContext(MetaContext);
  return context;
};

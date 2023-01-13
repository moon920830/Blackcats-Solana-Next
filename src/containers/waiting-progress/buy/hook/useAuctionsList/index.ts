import { useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useAuctions, AuctionView } from 'src/hooks_market';

import { LiveAuctionViewState } from '../..';
import { getFilterFunction, resaleAuctionsFilter } from './utils';
import { useMeta } from 'src/contexts/meta';

export const useAuctionsList = (
  activeKey: LiveAuctionViewState,
): { auctions: AuctionView[]; hasResaleAuctions: boolean } => {
  const { publicKey } = useWallet();
  
  const auctions = useAuctions();
  console.log('useAuctionsList.auctions', auctions);

  const { pullAuctionListData, isLoading } = useMeta();

  useEffect(() => {
    if (!auctions.length || isLoading) return;
    for (const auction of auctions) {
      pullAuctionListData(auction.auction.pubkey);
    }
  }, [auctions.length, isLoading]);

  const filteredAuctions = useMemo(() => {
    const filterFn = getFilterFunction(activeKey);

    return auctions.filter(auction => filterFn(auction, publicKey));
  }, [activeKey, auctions, publicKey]);

  const hasResaleAuctions = useMemo(() => {
    return auctions.some(auction => resaleAuctionsFilter(auction));
  }, [auctions]);

  return { auctions: filteredAuctions, hasResaleAuctions };
};

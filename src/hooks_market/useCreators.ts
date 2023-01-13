import { object } from 'prop-types';
import { useMemo } from 'react';
import { useMeta } from 'src/contexts/meta';
import { Artist } from '../types';
import { AuctionView } from './useAuctions';

export const useCreators = (auction?: AuctionView) => {
  const { whitelistedCreatorsByCreator } = useMeta();

  const creates_collection = (
    [
      ...(auction?.items || []).flat().map(item => item?.metadata),
      auction?.thumbnail?.metadata,
    ]
      .filter(item => item && item.info)
      .map(item => item?.info.data.creators || [])
      .flat() || []
  )

  const creators = useMemo(
    () =>
      [
        creates_collection
          .filter(creator => creator.verified)
          .reduce((agg, item) => {
            agg.set(item.address, item.share);
            return agg;
          }, new Map<string, number>())
          .entries(),
      ].map(creatorArray => {
        const creator = Object.keys(creatorArray)[0];
        const share = creatorArray[creator];

        const knownCreator = whitelistedCreatorsByCreator[creator];

        return {
          address: creator,
          verified: true,
          share: share,
          image: knownCreator?.info.image || '',
          name: knownCreator?.info.name || '',
          link: knownCreator?.info.twitter || '',
        } as Artist;
      }),
    [auction, whitelistedCreatorsByCreator],
  );

  return creators;
};

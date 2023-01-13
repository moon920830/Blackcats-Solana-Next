import { Connection, PublicKey } from '@solana/web3.js';
import {
  BidderMetadata,
  BidRedemptionTicket,
  ParsedAccount,
  PrizeTrackingTicket,
  sendTransactions,
  TokenAccount,
  WalletSigner,
} from '@oysterr/common';

import { claimUnusedPrizes } from 'src/actions/claimUnusedPrizes';
import { AuctionView } from 'src/hooks_market';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { endAuction } from 'src/models/metaplex/endAuction';

interface EndSaleParams {
  auctionView: AuctionView;
  connection: Connection;
  accountByMint: Map<string, TokenAccount>;
  bids: ParsedAccount<BidderMetadata>[];
  bidRedemptions: Record<string, ParsedAccount<BidRedemptionTicket>>;
  prizeTrackingTickets: Record<string, ParsedAccount<PrizeTrackingTicket>>;
  wallet: WalletContextState;
}

export async function endSale({
  auctionView,
  connection,
  accountByMint,
  bids,
  bidRedemptions,
  prizeTrackingTickets,
  wallet,
}: EndSaleParams) {
  const { vault, auctionManager } = auctionView;

  const endAuctionInstructions = [];
  await endAuction(
    new PublicKey(vault.pubkey),
    new PublicKey(auctionManager.authority),
    endAuctionInstructions,
  );

  const claimInstructions = [];
  const claimSigners = [];
  await claimUnusedPrizes(
    connection,
    wallet as WalletSigner,
    auctionView,
    accountByMint,
    bids,
    bidRedemptions,
    prizeTrackingTickets,
    claimSigners,
    claimInstructions,
  );

  const instructions = [endAuctionInstructions, ...claimInstructions];
  const signers = [[], ...claimSigners];

  return sendTransactions(connection, wallet as WalletSigner, instructions, signers);
}

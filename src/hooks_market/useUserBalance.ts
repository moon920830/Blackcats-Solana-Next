import {
  fromLamports,
  StringPublicKey,
  WRAPPED_SOL_MINT,
  useMint
} from '@oysterr/common';

// import {
//   useMint
// } from 'src/contexts/accounts'

import {
  useUserAccounts
} from 'src/hooks_market'
import { useEffect, useMemo, useState } from 'react';
import { useSolPrice, useAllSplPrices } from '../contexts';

export function useUserBalance(
  mintAddress?: StringPublicKey,
  account?: StringPublicKey,
) {
  const mint = useMemo(
    () => (typeof mintAddress === 'string' ? mintAddress : mintAddress),
    [mintAddress],
  );
  console.log('useUserBalance.mint', mint);

  const { userAccounts } = useUserAccounts();
  console.log('useUserBalance.userAccounts', userAccounts);

  const [balanceInUSD, setBalanceInUSD] = useState(0);

  const solPrice = useSolPrice();
  const altSplPrice = useAllSplPrices().filter(
    a => a.tokenMint == mintAddress,
  )[0]?.tokenPrice;
  const tokenPrice =
    mintAddress == WRAPPED_SOL_MINT.toBase58() ? solPrice : altSplPrice;

  const mintInfo = useMint(mint);
  console.log('useUserBalance.mintInfo', mintInfo);
  
  const accounts = useMemo(() => {
    return userAccounts
      .filter(
        acc => {

          console.log('useUserBalance.acc.info.mint', acc.info.mint.toBase58());
          return mint === acc.info.mint.toBase58() &&
          (!account || account === acc.pubkey);
        }          
      )
      .sort((a, b) => b.info.amount.sub(a.info.amount).toNumber());
  }, [userAccounts, mint, account]);
  console.log('useUserBalance.accounts', accounts);

  const balanceLamports = useMemo(() => {
    return accounts.reduce(
      // TODO: Edge-case: If a number is too big (more than 10Mil) and the decimals
      //    for the token are > 8, the lamports.toNumber() crashes, as it is more then 53 bits.
      (res, item) => (res += item.info.amount.toNumber()),
      0,
    );
  }, [accounts]);
  console.log('useUserBalance.balanceLamports', balanceLamports);

  const balance = useMemo(
    () => fromLamports(balanceLamports, mintInfo),
    [mintInfo, balanceLamports],
  );
  console.log('useUserBalance.balance', balance);

  useEffect(() => {
    setBalanceInUSD(balance * tokenPrice);
  }, [balance, tokenPrice, mint, setBalanceInUSD]);

  return {
    balance,
    balanceLamports,
    balanceInUSD,
    accounts,
    hasBalance: accounts.length > 0 && balance > 0,
  };
}

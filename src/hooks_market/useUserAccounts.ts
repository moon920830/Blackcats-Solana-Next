import { TokenAccount } from '@oysterr/common';
import { useAccountsContext } from 'src/contexts/accounts';

export function useUserAccounts(): {
  userAccounts: TokenAccount[];
  accountByMint: Map<string, TokenAccount>;
} {
  const context = useAccountsContext();
  console.log('useUserAccounts.context', context);
  
  const accountByMint = context.userAccounts.reduce(
    (prev: Map<string, TokenAccount>, acc: TokenAccount) => {
      prev.set(acc.info.mint.toBase58(), acc);
      return prev;
    },
    new Map<string, TokenAccount>(),
  );
  return {
    userAccounts: context.userAccounts as TokenAccount[],
    accountByMint,
  };
}

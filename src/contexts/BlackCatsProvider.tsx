import React, { useContext, useEffect, useState } from 'react';
import { MAX_METADATA_LEN } from '@oysterr/common';

import { CoingeckoProvider } from './coingecko';
import { SPLTokenListProvider } from './tokenList';
import { ConnectionProvider } from './connection';
import { AccountsProvider } from './accounts';
import { StoreProvider } from './store';
import { MetaProvider } from './meta';

const BlackCatsProvider = (props) => {
  const submitSearch = (searchKey) => {
    console.log('provider: ', searchKey);
    props.propFunction(searchKey);
  }

  return (
    <ConnectionProvider>
      <AccountsProvider>
        <SPLTokenListProvider>
          <CoingeckoProvider>
            <StoreProvider
              ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
              storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
            >
              <MetaProvider>
                {props.children}
              </MetaProvider>
            </StoreProvider>
          </CoingeckoProvider>
        </SPLTokenListProvider>
      </AccountsProvider>
    </ConnectionProvider>
  );

};

export default BlackCatsProvider;
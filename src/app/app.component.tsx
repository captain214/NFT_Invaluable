import { FC, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Web3ReactProvider } from '@web3-react/core';
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';

import './app.styles.scss';

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { Gallery } from './views/gallery';
import { Profile } from './views/profile/profile.component';
import { MainHeader } from './components/main-header/main-header.component';
import { MainFooter } from './views/main-footer/main-footer.component';
import { ItemDetails } from './views/item-details/item-details.component';
import { Routes } from './constants';
import { Marketplace } from './views/marketplace/marketplace.component';
import { Main } from './views/main/main.component';
import { MarketplaceFilterProvider } from './views/marketplace/components/MarketplaceFilterProvider/marketplace-filter-context';
import { CollectionPage } from './views/collection/collection.component';
import { HotBids } from './views/hot-bids/hot-bids.component';
import Web3ReactManager from './components/Web3ReactManager/web3ReactManager.component';
import { MintingDrop } from './views/minting-drop/minting-drop.component';
import { PrivacyPolicy } from './views/privacy-policy/privacy-policy.component';
import { TermsOfService } from './views/terms-of-service/terms-of-service.component';

export const App: FC = () => {
  const queryClient = useMemo(() => new QueryClient(), []);
  function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MarketplaceFilterProvider>
            <div className="app">
              <div className="app__header">
                <MainHeader />
              </div>
              <div className="app__body">
                <Web3ReactManager>
                  <Switch>
                    <Route exact path={Routes.HOME}>
                      <Main />
                    </Route>

                    <Route path={Routes.GALLERY}>
                      <Gallery />
                    </Route>

                    <Route path={Routes.COLLECTION}>
                      <CollectionPage />
                    </Route>

                    <Route exact path={Routes.PROFILE}>
                      <Profile />
                    </Route>

                    <Route path={Routes.MARKETPLACE}>
                      <Marketplace />
                    </Route>

                    <Route path={Routes.ITEM_DETAILS}>
                      <ItemDetails />
                    </Route>

                    <Route path={Routes.HOT_BIDS}>
                      <HotBids />
                    </Route>

                    <Route path={Routes.MINTING_DROP}>
                      <MintingDrop />
                    </Route>

                    <Route path={Routes.PRIVACY_POLICY}>
                      <PrivacyPolicy />
                    </Route>

                    <Route path={Routes.TERMS_OF_SERVICE}>
                      <TermsOfService />
                    </Route>

                    <Route path={Routes.USER}>
                      <Profile />
                    </Route>

                    <Redirect to={Routes.HOME} />
                  </Switch>
                </Web3ReactManager>
              </div>
              <div className="app__footer">
                <MainFooter />
              </div>
            </div>
          </MarketplaceFilterProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Web3ReactProvider>
  );
};

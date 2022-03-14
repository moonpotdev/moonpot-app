import React, { memo, Suspense, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import appTheme from './appTheme.js';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { RouteLoading } from './components/RouteLoading';
import { PageNotFound } from './PageNotFound';
import { Header } from './components/Header';
import { WrappedFooter } from './components/Footer';
import { useLocation } from 'react-router';
import { useImpersonate } from './helpers/hooks';
import { GoogleAnalytics } from './googleAnalytics';
import { GlobalDataLoader } from './components/GlobalDataLoader/GlobalDataLoader';
import { NetworkSelectModal } from './components/NetworkSelectModal/NetworkSelectModal';

require('dotenv').config();

const Home = React.lazy(() => import(`./features/home`));
const Pots = React.lazy(() => import(`./features/pots`));
const Vault = React.lazy(() => import(`./features/vault`));
const Winners = React.lazy(() => import(`./features/winners`));
const Dao = React.lazy(() => import(`./features/dao`));
const Promo = React.lazy(() => import(`./features/promo`));
const Promos = React.lazy(() => import(`./features/promo/promos`));

const Pages = memo(function Pages() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          exact
          path={[
            '/:tab(moonpots)/:category(all|main|nft)?',
            '/:tab(moonpots)/:network(bsc|fantom)?/:category(all|main|nft)?',
            '/:tab(my-moonpots)',
          ]}
        >
          <Pots />
        </Route>
        <Route strict sensitive exact path="/pot/:id">
          <Vault />
        </Route>
        <Route strict sensitive exact path="/winners">
          <Winners />
        </Route>
        <Route strict sensitive exact path="/ido">
          <Dao />
        </Route>
        <Route strict sensitive exact path="/promos">
          <Promos />
        </Route>
        <Route strict sensitive exact path="/promo/:name">
          <Promo />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  );
});

const ScrollToTop = memo(function () {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (!state || !state.tabbed) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
});

export default function App() {
  const theme = appTheme();
  useImpersonate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalDataLoader />
      <HashRouter>
        <ScrollToTop />
        <GoogleAnalytics />
        <WrappedFooter>
          <Header />
          <Pages />
        </WrappedFooter>
      </HashRouter>
      <NetworkSelectModal />
    </ThemeProvider>
  );
}

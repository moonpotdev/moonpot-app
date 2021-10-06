import React, { memo, Suspense, useEffect } from 'react';
import { load } from 'fathom-client';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import appTheme from './appTheme.js';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import reduxActions from './features/redux/actions';
import { RouteLoading } from './components/RouteLoading';
import { PageNotFound } from './PageNotFound';
import { Header } from './components/Header';
import Footer from './components/footer';
import ModalPopup from './components/Modal/modal.js';
import { useLocation } from 'react-router';
import { useImpersonate } from './helpers/hooks';

require('dotenv').config();

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Winners = React.lazy(() => import(`./features/winners`));
const Dao = React.lazy(() => import(`./features/dao`));

function Pages() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route
          exact
          path={['/:bottom(all|main|lp|stable|community)?', '/:top(my-moonpots)/:bottom(eol)?']}
        >
          <Home />
          <Footer variant="light" />
        </Route>
        <Route strict sensitive exact path="/pot/:id">
          <Vault />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/winners">
          <Winners />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/ido">
          <Dao />
          <Footer variant="dark" />
        </Route>
        <Route>
          <PageNotFound />
          <Footer variant="dark" />
        </Route>
      </Switch>
    </Suspense>
  );
}

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
  const dispatch = useDispatch();
  const theme = appTheme();
  useImpersonate();

  React.useEffect(() => {
    load(process.env.REACT_APP_FATHOM_SITE_ID, {
      url: process.env.REACT_APP_FATHOM_SITE_URL,
      spa: 'hash',
    });
  });

  React.useEffect(() => {
    dispatch(reduxActions.prices.fetchPrices());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(reduxActions.wallet.createWeb3Modal());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModalPopup />
      <HashRouter>
        <ScrollToTop />
        <Header />
        <Pages />
      </HashRouter>
    </ThemeProvider>
  );
}

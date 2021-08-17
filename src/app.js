import React, { memo, Suspense, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import appTheme from './appTheme.js';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import reduxActions from './features/redux/actions';
import { RouteLoading } from './components/RouteLoading';
import { PageNotFound } from './PageNotFound';
import { Header } from './components/Header';
import Footer from './components/footer';
import { useLocation } from 'react-router';

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Dashboard = React.lazy(() => import(`./features/dashboard`));
const Winners = React.lazy(() => import(`./features/winners`));
const Dao = React.lazy(() => import(`./features/dao`));

function Pages() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route exact path="/" key={Date.now()}>
          <Home />
        </Route>
        <Route strict sensitive exact path="/pot/:id">
          <Vault />
        </Route>
        <Route strict sensitive exact path="/my-moonpots/:status?">
          <Dashboard />
        </Route>
        <Route strict sensitive exact path="/winners">
          <Winners />
        </Route>
        <Route strict sensitive exact path="/ido">
          <Dao />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  );
}

const ScrollToTop = memo(function () {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
});

export default function App() {
  const dispatch = useDispatch();
  const theme = appTheme();

  React.useEffect(() => {
    dispatch(reduxActions.prices.fetchPrices());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(reduxActions.wallet.createWeb3Modal());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <ScrollToTop />
        <Header />
        <Pages />
        <Footer />
      </HashRouter>
    </ThemeProvider>
  );
}

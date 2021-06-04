import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import appTheme from "./appTheme.js";
import Header from "./components/header";
import Footer from "./components/footer";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import {useDispatch} from "react-redux";
import reduxActions from "./features/redux/actions";

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Dashboard = React.lazy(() => import(`./features/dashboard`));

const PageNotFound = () => {
    return <div>Page not found.</div>;
}

export default function App() {
    const dispatch = useDispatch();
    const theme = appTheme();

    React.useEffect(() => {
        dispatch(reduxActions.vault.fetchPools());
        dispatch(reduxActions.wallet.fetchRpc());
        dispatch(reduxActions.wallet.createWeb3Modal());
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Header />
                <React.Suspense fallback={<div className="loader"/>}>
                    <Switch>
                        <Route exact path="/" key={Date.now()}>
                            <Home />
                        </Route>
                        <Route strict sensitive exact path="/pot/:id">
                            <Vault />
                        </Route>
                        <Route strict sensitive exact path="/my-moonpots">
                            <Dashboard />
                        </Route>
                        <Route>
                            <PageNotFound />
                        </Route>
                    </Switch>
                </React.Suspense>
                <Footer />
            </Router>
        </ThemeProvider>
    );
}

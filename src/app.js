import React, {Suspense} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import appTheme from './appTheme.js';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import reduxActions from './features/redux/actions';
import {RouteLoading} from './components/RouteLoading';
import {PageNotFound} from './PageNotFound';
import {Header} from './components/Header';
import Footer from './components/footer';
import ModalPopup from './components/Modal/modal.js';

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Dashboard = React.lazy(() => import(`./features/dashboard`));
const Dao = React.lazy(() => import(`./features/dao`));

function Pages() {
	return <Suspense fallback={<RouteLoading/>}>
		<Switch>
			<Route exact path="/" key={Date.now()}>
				<Home/>
			</Route>
			<Route strict sensitive exact path="/pot/:id">
				<Vault/>
			</Route>
			<Route strict sensitive exact path="/my-moonpots/:status?">
				<Dashboard/>
			</Route>
			<Route strict sensitive exact path="/ido">
				<Dao/>
			</Route>
			<Route>
				<PageNotFound/>
			</Route>
		</Switch>
	</Suspense>;
}

export default function App() {
	const dispatch = useDispatch();
	const theme = appTheme();

	React.useEffect(() => {
		dispatch(reduxActions.prices.fetchPrices());
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(reduxActions.wallet.createWeb3Modal());
	}, [dispatch]);

	function showModalPopup() {
		dispatch(reduxActions.modal.showModal());
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			<button onClick={showModalPopup} >
				<h1>TEST</h1>
			</button>
			<ModalPopup/>
			<HashRouter>
				<Header/>
				<Pages/>
				<Footer/>
			</HashRouter>
		</ThemeProvider>
	);
}

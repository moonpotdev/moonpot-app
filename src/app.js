import React, {useContext, useState} from 'react';
import {HashRouter, Route, Switch, useHistory} from 'react-router-dom';
import appTheme from './appTheme.js';
import Header from './components/header';
import Footer from './components/footer';
import {Box, CssBaseline, Grid, Link, makeStyles, ThemeProvider} from '@material-ui/core';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import {useDispatch, useSelector} from 'react-redux';
import reduxActions from './features/redux/actions';
import {slide as Menu} from 'react-burger-menu';
import {useTranslation} from 'react-i18next';
import WalletContainer from './components/header/components/WalletContainer';
import {createHashHistory} from 'history';
import Media from 'react-media';
import {burgerMenuStyles, styles} from './styles.js';
import {PageNotFound} from './PageNotFound';
import {RouteLoading} from './components/RouteLoading/RouteLoading';

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Dashboard = React.lazy(() => import(`./features/dashboard`));
const Dao = React.lazy(() => import(`./features/dao`));

const Context = React.createContext();

const Provider = (props) => {
    const [menuOpenState, setMenuOpenState] = useState(false)

    return (
        <Context.Provider value={{
            isMenuOpen: menuOpenState,
            toggleMenu: () => setMenuOpenState(!menuOpenState),
            stateChangeHandler: (newState) => {
                setMenuOpenState(newState.isOpen);

                let nextLogoState = ( newState.isOpen ) ? "none" : "";
                let stateTimeout = ( newState.isOpen ) ? 0 : 250;

                setTimeout(function() {
                    // element does not exist on resize render
                    const logo = document.getElementById("logo");
                    if (logo) {
                        logo.style.display = nextLogoState;
                    }

                }, stateTimeout);
            }
          }}>
            {props.children}
          </Context.Provider>
    )
};

const Navigation = () => {
    const ctx = useContext(Context)

    const {t} = useTranslation();
    const history = useHistory();
    const walletReducer = useSelector(state => state.walletReducer);

    const useStyles = makeStyles(styles);
    const classes = useStyles();

    return (
        <React.Fragment>
                <Box id="logo" onClick={() => {history.push('/')}}>
                    <img alt="Moonpot" className={classes.moonpotImage} src={require('./images/moonpot-dot-com.png').default}/>
                </Box>
            <Menu
                customBurgerIcon={ <MenuRoundedIcon/> }
                isOpen={ctx.isMenuOpen}
                onStateChange={(state) => ctx.stateChangeHandler(state)}
                disableAutoFocus
                styles={ burgerMenuStyles }
            >
                <Grid
                container
                direction="column"
                justifyContent="space-evenly"
                spacing={3}
                >
                    <Grid item xs={10} style={{height: '15%'}}>

                    </Grid>
                    <Grid item xs={10} align={"left"}>
                        <Link
                        className={classes.mobileNavItem}
                        onClick={() => {
                            history.push('/');
                            ctx.toggleMenu();
                        }}>
                            {t('buttons.moonpots')}
                        </Link>
                    </Grid>
                    <Grid item xs={10} align={"left"}>
                        <Link className={classes.mobileNavItem} onClick={() => {
                            history.push('/my-moonpots');
                            ctx.toggleMenu();
                        }}>
                            {t('buttons.myPots')}
                        </Link>
                    </Grid>
                    <Grid item xs={10} align={"left"}>
                        <Link className={classes.mobileNavItem} onClick={() => {
                            history.push('/ido');
                            ctx.toggleMenu();
                        }}>
                            {t('buttons.ido')}
                        </Link>
                    </Grid>
                    <Grid item xs={10} align={"left"}>
                        <Link className={classes.mobileNavItem} href={"https://docs.moonpot.com"} onClick={() => {
                            ctx.toggleMenu();
                        }}>
                            {t('buttons.docs')}
                        </Link>
                    </Grid>
                    <Grid item xs={12} className={classes.mobileNavWallet} align={"center"} onClick={() => {
                            (walletReducer.address ? void 0 : ctx.toggleMenu())
                    }}>
                        <WalletContainer />
                    </Grid>
                </Grid>
            </Menu>
        </React.Fragment>


    )
  }

export default function App() {
    const dispatch = useDispatch();
    const theme = appTheme();

    React.useEffect(() => {
        const initiate = async () => {
            await dispatch(reduxActions.prices.fetchPrices());
        }
        return initiate();
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(reduxActions.wallet.createWeb3Modal());
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter history={createHashHistory()}>
                <Provider>
                    <Media query="(max-width: 1100px)">
                        {matches =>
                            matches ? (
                                <Navigation />
                            ) : (
                                <Header />
                            )
                        }
                    </Media>
                    <React.Suspense fallback={<RouteLoading/>}>
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
                            <Route strict sensitive exact path="/ido">
                                <Dao />
                            </Route>
                            <Route>
                                <PageNotFound />
                            </Route>
                        </Switch>
                    </React.Suspense>
                    <Footer />
                </Provider>
            </HashRouter>
        </ThemeProvider>
    );
}

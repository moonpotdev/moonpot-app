import React, { useState, useRef, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import appTheme from "./appTheme.js";
import Header from "./components/header";
import Footer from "./components/footer";
import { ThemeProvider, CssBaseline, Grid } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import {useDispatch} from "react-redux";
import reduxActions from "./features/redux/actions";
import {slide as Menu} from "react-burger-menu";

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Dashboard = React.lazy(() => import(`./features/dashboard`));

const PageNotFound = () => {
    return <div>Page not found.</div>;

}

const burgerMenuStyles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '20px',
      height: '20px',
      right: '2.5%',
      top: '5%',
      color: '#FFFFFF',
    },
    bmBurgerBars: {
      background: '#FFFFFF'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
      right: '2.5%',
      top: '5%',
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      width: '100%',
    },
    bmMenu: {
      background: '#262640',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {
      display: 'inline-block'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
}

const Context = React.createContext();

const Provider = (props) => {
    const [menuOpenState, setMenuOpenState] = useState(false)

    return (
        <Context.Provider value={{
            isMenuOpen: menuOpenState,
            toggleMenu: () => setMenuOpenState(!menuOpenState),
            stateChangeHandler: (newState) => setMenuOpenState(newState.isOpen)
          }}>
            {props.children}
          </Context.Provider>
    )
};

const Navigation = () => {
    const ctx = useContext(Context)
  
    return (
      <Menu 
        customBurgerIcon={ <MenuRoundedIcon/> }
        isOpen={ctx.isMenuOpen}
        onStateChange={(state) => ctx.stateChangeHandler(state)}
        styles={ burgerMenuStyles }


      />
    )
  }

export default function App() {
    const dispatch = useDispatch();
    const theme = appTheme();

    React.useEffect(() => {
        dispatch(reduxActions.wallet.createWeb3Modal());
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Provider>
                    { window.innerWidth > 700 ? (
                            <Navigation />
                    ) : (
                        <Header />
                    )}
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
                </Provider>
                
            </Router>
        </ThemeProvider>
    );
}

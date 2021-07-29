import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, makeStyles } from "@material-ui/core";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import {slide as Menu} from "react-burger-menu";
import {useTranslation} from "react-i18next";
import WalletContainer from "../header/components/WalletContainer";
import CustomDropdown from "../customDropdown";
import {useDispatch, useSelector} from "react-redux";
import reduxActions from "../../features/redux/actions";

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
    },
    wallet: {
        borderColor: '#FFFFFF',
        width: '90%',
    },
    navLink: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 500,
        fontSize: '21px',
        lineHeight: '24.13px',
    },
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

const navLinks = {
    navLink: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 500,
        fontSize: '21px',
        lineHeight: '24.13px',
    },
};

const menuDropdowns = {
    menuDropdowns: {
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 500,
        fontSize: '21px',
        lineHeight: '24.13px',
    },
};

const MobileHeader = () => {
    const ctx = useContext(Context)

    const {i18n, t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const walletReducer = useSelector(state => state.walletReducer);

    const handleLanguageSwitch = (value) => {
        i18n.changeLanguage(value).then(() => dispatch(reduxActions.wallet.setLanguage(value)));
    }

    const handleCurrencySwitch = (value) => {
        dispatch(reduxActions.wallet.setCurrency(value));
        history.push('/');
    }
    const classes = makeStyles(
        ({
            mobileNav: {
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                fontWeight: 500,
                fontSize: '21px',
                lineHeight: '24px',
            },
            wallet: {
                borderColor: '#FFFFFF',
                width: '90%',
            },
        })
    );
  
    return (
        <Menu 
            customBurgerIcon={ <MenuRoundedIcon/> }
            isOpen={ctx.isMenuOpen}
            onStateChange={(state) => ctx.stateChangeHandler(state)}
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
                    <Button onClick={() => {history.push('/')}} css={navLinks}>
                        {t('buttons.moonpots')}
                    </Button>
                </Grid>
                <Grid item xs={10} align={"left"}>
                    <Button className={classes.mobileNav} onClick={() => {history.push('/my-moonpots')}}>
                        {t('buttons.myPots')}
                    </Button>
                </Grid>
                <Grid item xs={10} align={"left"}>
                    <Button className={classes.mobileNav} onClick={() => {history.push('/dao')}}>
                        {t('buttons.dao')}
                    </Button>
                </Grid>
                <Grid item xs={10} align={"left"}>
                    <Button className={classes.mobileNav} href={"https://docs.moonpot.com"}>
                        {t('buttons.docs')}
                    </Button>
                </Grid>
                <Grid item xs={8} align={"left"}>
                    <CustomDropdown list={{'usd': 'USD', 'eur': 'EUR', 'gbp': 'GBP'}} selected={walletReducer.currency} handler={(e) => {handleCurrencySwitch(e.target.value)}} css={menuDropdowns}/>
                </Grid>
                <Grid item xs={8} align={"left"}>
                    <CustomDropdown list={{'en': 'EN', 'fr': 'FR'}} selected={walletReducer.language} handler={(e) => {handleLanguageSwitch(e.target.value)}}/>
                </Grid>
                <Grid item xs={12} className={classes.wallet} align={"center"}>
                    <WalletContainer />
                </Grid>
            </Grid>
        </Menu>
    )
}

export default MobileHeader;
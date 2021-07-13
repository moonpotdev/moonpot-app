import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import reduxActions from "../../features/redux/actions";
import {
    makeStyles,
    AppBar,
    Toolbar,
    Grid,
    Link,
    Box,
} from "@material-ui/core";
import styles from "./styles"
import WalletContainer from "./components/WalletContainer";
import CustomDropdown from "../customDropdown";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

const Header = () => {
    const { i18n, t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const walletReducer = useSelector(state => state.walletReducer);
    const classes = useStyles();

    const handleLanguageSwitch = (value) => {
        i18n.changeLanguage(value).then(() => dispatch(reduxActions.wallet.setLanguage(value)));
    }

    const handleCurrencySwitch = (value) => {
        dispatch(reduxActions.wallet.setCurrency(value));
    }

    const customDropdownCss = {
        marginRight: '25px',
    } 

    return (
        <AppBar className={classes.navHeader} position="static">
            <Toolbar>
                <Grid container spacing={2}>
                    <Grid item xs={3} align={"left"}>
                        <Box className={classes.logo} onClick={() => {history.push('/')}}>
                            <img alt="Moonpot" height="36px" src={require('../../images/moonpot-dot-com.png').default} />
                        </Box>
                    </Grid>
                    
                    <Grid item xs={5} align={"center"}>
                        <Link className={classes.navLink} onClick={() => {history.push('/')}}>
                            {t('buttons.moonpots')}
                        </Link>
                        <Link className={classes.navLink} onClick={() => {history.push('/my-moonpots')}}>
                            {t('buttons.myPots')}
                        </Link>
                        <Link className={classes.navLink} href={"https://docs.moonpot.com"}>
                            {t('buttons.docs')}
                        </Link>
                    </Grid>
                    
                    
                    <Grid item xs={3} css={{paddingRight: '20px'}}>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <CustomDropdown list={{'usd': 'USD', 'eur': 'EUR', 'gbp': 'GBP'}} selected={walletReducer.currency} handler={(e) => {handleCurrencySwitch(e.target.value)}} css={customDropdownCss} />
                            </Grid>
                            <Grid item xs={3}>
                                <CustomDropdown list={{'en': 'EN', 'fr': 'FR'}} selected={walletReducer.language} handler={(e) => {handleLanguageSwitch(e.target.value)}} css={customDropdownCss} />
                            </Grid>
                            <Grid item xs={6}>
                                <WalletContainer />
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

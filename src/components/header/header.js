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
                    <Grid item className={classes.logoContainer} xs={3} align={"left"}>
                        <Box className={classes.logo} onClick={() => {history.push('/')}}>
                            <img 
                            alt="Moonpot" 
                            height="36px"
                            srcset="
                                images/header/moonpot-desktop-logo@4x.png 4x,
                                images/header/moonpot-desktop-logo@3x.png 3x,
                                images/header/moonpot-desktop-logo@2x.png 2x,
                                images/header/moonpot-desktop-logo@1x.png 1x
                            " 
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item className={classes.navContainer} xs={5} align={"center"}>
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
                    
                    
                    <Grid item className={classes.walletContainerContainer} xs={3}>
                            <Grid item xs={12} align={"right"}>
                                <WalletContainer />
                            </Grid>
                    </Grid>
                    
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

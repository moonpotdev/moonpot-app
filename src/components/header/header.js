import * as React from "react";
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import reduxActions from "../../features/redux/actions";
import {
    makeStyles,
    AppBar,
    Toolbar,
    Container,
    List,
    Box,
} from "@material-ui/core";
import styles from "./styles"
import WalletContainer from "./components/WalletContainer";
import CustomDropdown from "../customDropdown";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

const Header = () => {
    const { i18n } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const walletReducer = useSelector(state => state.walletReducer);
    const classes = useStyles();

    const handleLanguageSwitch = (value) => {
        i18n.changeLanguage(value).then(() => dispatch(reduxActions.wallet.setLanguage(value)));
    }

    const handleCurrencySwitch = (value) => {
        dispatch(reduxActions.wallet.setCurrency(value));
        history.push('/');
    }

    return (
        <AppBar className={classes.navHeader} position="static">
            <Toolbar>
                <Container maxWidth="xl" className={classes.navDisplayFlex}>
                    <Box className={classes.logo} onClick={() => {history.push('/')}}>
                        {walletReducer.address ? (
                            <img alt="Moonpot" src={require('../../images/moonpot-notext.svg').default} />
                        ) : (
                            <img alt="Moonpot" src={require('../../images/moonpot.svg').default} />
                        )}
                    </Box>
                    <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
                        <WalletContainer />
                    </List>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

import {Button, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import * as React from "react";
import styles from "./styles";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

const Footer = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid className={classes.footer} container spacing={2}>
                <Grid item xs={12}>
                    <Typography className={classes.beefy}>{t('footerPoweredBy')} <Link href={"https://beefy.finance"}>Beefy.Finance</Link> <img alt="Beefy Finance" src={require('../../images/beefy.svg').default} /></Typography>
                </Grid>
                <Grid item xs={10}>
                    <Button href={"https://docs.moonpot.com"} className={classes.footerBtn} variant={'outlined'} size={'small'}>{t('buttons.ziggyMoonpotGuide')}</Button>
                </Grid>
                <Grid className={classes.footerIcons} item xs={12}>
                    <Link href={"a"}><img alt="Github" src={require('../../images/icons/github.svg').default} /></Link>
                    <Link href={"a"}><img alt="Telegram" src={require('../../images/icons/telegram.svg').default} /></Link>
                    <Link href={"a"}><img alt="Discord" src={require('../../images/icons/discord.svg').default} /></Link>
                    <Link href={"a"}><img alt="Youtube" src={require('../../images/icons/youtube.svg').default} /></Link>
                    <Link href={"a"}><img alt="Twitter" src={require('../../images/icons/twitter.svg').default} /></Link>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Footer;

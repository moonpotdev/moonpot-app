import {Button, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import * as React from "react";
import styles from "./styles";

const useStyles = makeStyles(styles);

const Footer = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid className={classes.footer} container spacing={2}>
                <Grid item xs={12}>
                    <Typography className={classes.beefy}>Powered by <Link href={"https://beefy.finance"}>Beefy.Finance</Link> <img alt="Beefy Finance" src={require('../../images/beefy.svg').default} /></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button className={classes.footerBtn} variant={'outlined'} color={'primary'}>Ziggy's Moonpot Guide</Button>
                    <Button className={classes.footerBtn} variant={'outlined'} color={'primary'}>Moonpot Stats</Button>
                </Grid>
                <Grid className={classes.footerIcons} item xs={12}>
                    <Link href={"a"}><img alt="Github" src={require('../../images/icons/github.svg').default} /></Link>
                    <Link href={"a"}><img alt="Telegram" src={require('../../images/icons/telegram.svg').default} /></Link>
                    <Link href={"a"}><img alt="Discord" src={require('../../images/icons/discord.svg').default} /></Link>
                    <Link href={"a"}><img alt="Youtube" src={require('../../images/icons/youtube.svg').default} /></Link>
                    <Link href={"a"}><img alt="Medium" src={require('../../images/icons/medium.svg').default} /></Link>
                    <Link href={"a"}><img alt="Twitter" src={require('../../images/icons/twitter.svg').default} /></Link>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Footer;

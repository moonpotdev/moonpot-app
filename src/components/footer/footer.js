import {Button, Container, Grid, Link, makeStyles} from '@material-ui/core';
import * as React from "react";
import styles from "./styles";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

const Footer = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth='xl'>
                <Grid className={classes.footer} container spacing={2}>
                    <Grid item xs={12}>
                        <Button href={"https://moonpot.com/alpha"} className={classes.footerBtn} variant={'outlined'} size={'small'}>{t('buttons.moonpotAlpha')}</Button>
                    </Grid>
                    <Grid className={classes.footerIcons} item xs={12}>
                        <Link href={"https://github.com/moonpotdev"}><img alt="Github" src={require('../../images/footer/github.svg').default} className={classes.footerImage}/>
                        </Link>
                        <Link href={"https://t.me/moonpotdotcom"}><img alt="Telegram" src={require('../../images/footer/telegram.svg').default} className={classes.footerImage} />
                        </Link>
                        <Link href={"https://discord.gg/8YquFwfw3N"}><img alt="Discord" src={require('../../images/footer/discord.svg').default} className={classes.footerImage} />
                        </Link>
                        <Link href={"https://www.youtube.com/channel/UCCwZh5FBKusmzmT5Q3Yisdg"}><img alt="Youtube" src={require('../../images/footer/youtube.svg').default} className={classes.footerImage} />
                        </Link>
                        <Link href={"https://twitter.com/moonpotdotcom"}><img alt="Twitter" src={require('../../images/footer/twitter.svg').default} className={classes.footerImage} />
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}

export default Footer;

import {Button, Grid, Link, makeStyles} from "@material-ui/core";
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
                    <Button href={"https://moonpot.com/alpha"} className={classes.footerBtn} variant={'outlined'} size={'small'}>{t('buttons.moonpotAlpha')}</Button>
                </Grid>
                <Grid className={classes.footerIcons} item xs={12}>
                    <Link href={"https://github.com/moonpotdev"}><img alt="Github" srcSet={`
                                                            images/footer/github@4x.png 4x,
                                                            images/footer/github@3x.png 3x,
                                                            images/footer/github@2x.png 2x,
                                                            images/footer/github@1x.png 1x,
                                                        `} /></Link>
                    <Link href={"https://t.me/moonpotdotcom"}><img alt="Telegram" srcSet={`
                                                            images/footer/telegram@4x.png 4x,
                                                            images/footer/telegram@3x.png 3x,
                                                            images/footer/telegram@2x.png 2x,
                                                            images/footer/telegram@1x.png 1x,
                                                        `} /></Link>
                    <Link href={"https://discord.gg/8YquFwfw3N"}><img alt="Discord" srcSet={`
                                                            images/footer/discord@4x.png 4x,
                                                            images/footer/discord@3x.png 3x,
                                                            images/footer/discord@2x.png 2x,
                                                            images/footer/discord@1x.png 1x,
                                                        `} /></Link>
                    <Link href={"https://www.youtube.com/channel/UCCwZh5FBKusmzmT5Q3Yisdg"}><img alt="Youtube" srcSet={`
                                                            images/footer/youtube@4x.png 4x,
                                                            images/footer/youtube@3x.png 3x,
                                                            images/footer/youtube@2x.png 2x,
                                                            images/footer/youtube@1x.png 1x,
                                                        `} /></Link>
                    <Link href={"https://twitter.com/moonpotdotcom"}><img alt="Twitter" srcSet={`
                                                            images/footer/twitter@4x.png 4x,
                                                            images/footer/twitter@3x.png 3x,
                                                            images/footer/twitter@2x.png 2x,
                                                            images/footer/twitter@1x.png 1x,
                                                        `} /></Link>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Footer;

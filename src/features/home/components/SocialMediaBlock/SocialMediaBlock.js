import React from 'react';
import styles from './styles';
import {Box, Button, makeStyles} from '@material-ui/core';
import {Trans} from 'react-i18next';
import telegramIcon from '../../../../images/icons/telegramPurple.svg';
import discordIcon from '../../../../images/icons/discordPurple.svg';
import twitterIcon from '../../../../images/icons/twitterPurple.svg';

const useStyles = makeStyles(styles);

export default function SocialMediaBlock({ type }) {

    const classes = useStyles();

    const transKeyBody = type + "SocialBlockBody";
    const transKeyButton = type + "SocialBlockButton";

    var activeIcon;
    var activeLink;

    if(type === "telegram") {
        activeIcon = telegramIcon;
        activeLink = "https://t.me/moonpotdotcom";
    } else if (type === "discord") {
        activeIcon = discordIcon;
        activeLink = "https://discord.gg/8YquFwfw3N";
    } else if (type === "twitter") {
        activeIcon = twitterIcon;
        activeLink = "https://twitter.com/moonpotdotcom";
    }

    return(
        <Box className={classes.block}>
            <img src={activeIcon} className={classes.image}  alt=""/>
            <div className={classes.text}>
                <Trans i18nKey={transKeyBody}/>
			</div>
            <a href={activeLink} className={classes.link}>
                <Button className={classes.button}>
                    <Trans i18nKey={transKeyButton}/>
                </Button>
            </a>
        </Box>
    )
}
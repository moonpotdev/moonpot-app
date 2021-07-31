import React from 'react';
import {Card, Cards, CardTitle} from './components/Cards/Cards';
import {Container, makeStyles, Typography} from '@material-ui/core';
import ZiggyMaintenance from './images/ziggy/maintenance.svg';
import {ButtonWhitePurpleDark} from './components/Buttons/ButtonWhitePurpleDark';

const useStyles = makeStyles(() => ({
	ziggy: {
		margin: '0 auto 24px auto',
		display: 'block',
	},
	button: {
		margin: '24px auto 0 auto',
	},
}));

export const PageNotFound = () => {
	const classes = useStyles();

	return <Container maxWidth="xl">
		<Cards>
			<Card variant="purpleDark">
				<img src={ZiggyMaintenance} width={104} height={104} alt="" aria-hidden={true}
					 className={classes.ziggy}/>
				<CardTitle align="center" variant="purpleDark">Page Not Found</CardTitle>
				<Typography align="center">Looks like you are lost in space</Typography>
				<ButtonWhitePurpleDark to="/" className={classes.button}>Go back home</ButtonWhitePurpleDark>
			</Card>
		</Cards>
	</Container>;
};
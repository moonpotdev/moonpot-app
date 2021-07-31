import {withStyles} from '@material-ui/core';
import {BaseButton} from './BaseButton';

export const ButtonWhitePurpleLight = withStyles({
	root: {
		backgroundColor: '#FFFFFF',
		color: '#6F609A',
		'&:hover': {
			backgroundColor: '#e8e8e8',
		},
		'&.Mui-disabled': {
			color: '#6F609A',
			backgroundColor: 'rgba(255, 255, 255, 0.6)',
		}
	}
})(BaseButton);
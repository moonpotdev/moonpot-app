import {Button, withStyles} from '@material-ui/core';

export const ButtonWhite = withStyles({
	root: {
		backgroundColor: '#FFFFFF',
		borderRadius: '8px',
		fontWeight: 700,
		fontSize: '15px',
		lineHeight: '24px',
		letterSpacing: '0.2px',
		color: '#6F609A',
		display: 'block',
		padding: 12,
		height: 'auto',
		textAlign: 'center',
		'&:hover': {
			backgroundColor: '#e8e8e8',
		},
		'&.Mui-disabled': {
			color: '#6F609A',
			backgroundColor: 'rgba(255, 255, 255, 0.6)',
		}
	},
})(Button);
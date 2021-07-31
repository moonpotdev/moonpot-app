import {makeStyles} from '@material-ui/core';

const styles = () => ({
	cards: {
		'& > $card + $card': {
			marginTop: '24px',
		}
	},
	card: {
		width: '500px',
		maxWidth: '100%',
		borderRadius: '16px',
		boxSizing: 'border-box',
		margin: '0 auto',
		padding: '24px',
		borderWidth: '2px',
		borderStyle: 'solid',
		boxShadow: '0px 4px 24px 24px rgba(19, 17, 34, 0.16)',
	},
	cardPurpleDark: {
		color: '#DFDFEC',
		backgroundColor: '#393960',
		borderColor: '#6753DB',
	},
	cardPurpleLight: {
		color: '#ECEAFB',
		backgroundColor: '#70609A',
		borderColor: '#8A7EAF',
	},
	cardTealDark: {
		color: '#EBF3F9',
		backgroundColor: '#345675',
		borderColor: '#436F97',
	},
	cardTealLight: {
		color: '#EBF3F9',
		backgroundColor: '#437098',
		borderColor: '#5989B5',
	},
	cardWhite: {
		color: '#585464',
		backgroundColor: '#ffffff',
		borderColor: '#F3F2F8',
	},
	title: {
		fontWeight: 500,
		fontSize: '19px',
		lineHeight: '28px',
		letterSpacing: '0.6px',
		marginBottom: 24,
	},
	titlePurpleDark: {
		color: '#FAFAFC',
	},
	titlePurpleLight: {
		color: '#EBF3F9',
	},
	titleTealDark: {
		color: '#EBF3F9',
	},
	titleTealLight: {
		color: '#EBF3F9',
	},
	titleWhite: {
		color: '#6753DB'
	},
});

export default styles;
export const useStyles = makeStyles(styles);

import {withStyles} from '@material-ui/core';
import {BaseButton} from './BaseButton';

export const ButtonPurpleWhite = withStyles({
	root: {
		backgroundColor: '#6753DB',
		color: '#ffffff',
		'&:hover': {
			backgroundColor: '#634fd1',
		},
		'&.Mui-disabled': {
			color: '#ffffff',
			backgroundColor: 'rgba(103, 83, 219, 0.6)',
		}
	}
})(BaseButton);
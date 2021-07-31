export const styles = () => ({
	bar: {
		padding: '24px 16px',
		color: '#ffffff',
		width: `${1110 + (16 * 2)}px`,
		maxWidth: '100%',
		margin: '0 auto 16px auto',
	},
	barInner: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		marginLeft: '-16px',
		marginRight: '-16px',
	},
	barItem: {
		padding: '0 16px',
	},
	logoLink: {
		display: 'block',
	},
	logo: {
		display: 'block',
	},
	nav: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		'& > $navItem + $navItem': {
			marginLeft: '32px',
		},
	},
	navItem: {
		color: '#CDCDE4',
		fontWeight: '500',
		fontSize: '15px',
		lineHeight: '17px',
		textDecoration: 'none',
		letterSpacing: '0.6px',
		textTransform: 'uppercase',
		'&:hover, &:focus, &:active, &[data-active]': {
			color: '#ffffff',
			textDecoration: 'none',
		}
	},
	toggleSidebar: {
		padding: '6px',
		marginLeft: 'auto',
	},
	sidebar: {
		background: '#262640',
		width: '375px',
		maxWidth: '100%',
		color: '#ffffff',
		minHeight: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	sidebarTop: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		padding: '24px 16px',
	},
	sidebarNav: {
		display: 'flex',
		flexDirection: 'column',
		padding: '24px',
		'& > $sidebarItem + $sidebarItem': {
			marginTop: '32px',
		},
	},
	sidebarItem: {
		color: '#ffffff',
		fontWeight: '500',
		fontSize: '21px',
		lineHeight: '24px',
		textDecoration: 'none',
		'&:hover, &:focus, &:active, &[data-active]': {
			color: '#ffffff',
			textDecoration: 'none',
		}
	},
	sidebarBottom: {
		marginTop: 'auto',
		padding: '24px 24px 32px 24px',
	},
	pushRight: {
		marginLeft: 'auto',
	}
});


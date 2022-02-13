export const HEADER_FULL_LOGO_WIDTH = 472;
export const HEADER_FULL_NAV_WIDTH = 1150;

export const styles = () => ({
  bar: {
    padding: '0 16px',
    color: '#ffffff',
    backgroundColor: '#262640',
    maxWidth: '100%',
    margin: '0 auto 32px auto',
    [`@media (min-width: ${HEADER_FULL_LOGO_WIDTH}px)`]: {
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  },
  barSizer: {
    width: '1220px',
    maxWidth: '100%',
    margin: '0 auto',
  },
  barInner: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    marginLeft: '-8px',
    marginRight: '-8px',
    [`@media (min-width: ${HEADER_FULL_LOGO_WIDTH}px)`]: {
      marginLeft: '-12px',
      marginRight: '-12px',
    },
    [`@media (min-width: ${HEADER_FULL_NAV_WIDTH}px)`]: {
      marginLeft: '-24px',
      marginRight: '-24px',
    },
  },
  barItem: {
    padding: '24px 8px',
    display: 'flex',
    [`@media (min-width: ${HEADER_FULL_LOGO_WIDTH}px)`]: {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
    [`@media (min-width: ${HEADER_FULL_NAV_WIDTH}px)`]: {
      borderRight: 'solid 1px #303050',
      paddingLeft: '24px',
      paddingRight: '24px',
      '&:first-child': {
        borderRight: '0',
      },
      '&:last-child': {
        borderRight: '0',
      },
      '&$pushRight': {
        paddingLeft: 0,
      },
    },
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
      marginLeft: '24px',
    },
    '& .MuiSelect-root': {
      color: '#CDCDE4',
      fontSize: '15px',
      letterSpacing: '0.6px',
    },
    '& .MuiSelect-icon': {
      color: '#CDCDE4',
    },
  },
  navItem: {
    color: '#CDCDE4',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '24px',
    textDecoration: 'none',
    letterSpacing: '0.6px',
    '&:hover, &:focus, &:active, &[data-active]': {
      color: '#ffffff',
      textDecoration: 'none',
    },
  },
  buyButton: {
    width: 'auto',
    color: '#6753DB',
    borderRadius: '70px',
    whiteSpace: 'nowrap',
    padding: '0 24px',
  },
  navbarPotsPrice: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textDecoration: 'none',
  },
  navbarPotsLogo: {
    marginRight: '8px',
  },
  navbarPotsValue: {
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    color: '#ffffff',
  },
  navbarBuyButton: {
    height: '36px',
    marginLeft: '24px',
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
    borderBottom: 'solid 2px #303050',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    '& > $sidebarItem + $sidebarItem': {
      marginTop: '32px',
    },
    '& .MuiSelect-root': {
      color: '#fff',
      fontSize: '21px',
    },
    '& .MuiSelect-icon': {
      color: '#fff',
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
    },
  },
  sidebarBottom: {
    borderTop: 'solid 2px #303050',
    marginTop: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'row',
  },
  sidebarPotsPrice: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarPotsLabel: {
    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: '18px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#D6D6EB',
  },
  sidebarPotsValue: {
    fontWeight: 'bold',
    fontSize: '19px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    color: '#ffffff',
  },
  sidebarPotsText: {
    marginLeft: '9px',
  },
  sidebarBuyButton: {
    height: '48px',
    marginLeft: 'auto',
    flexBasis: '173px',
    flexGrow: '0',
    flexShrink: '1',
  },
  sidebarPotsLogo: {},
  pushRight: {
    marginLeft: 'auto',
  },
});

const styles = theme => ({
  multichain: {
    background: '#FFFFFF',
    textAlign: 'center',
    '&::after': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '0 0 3vw 100vw',
      borderColor: 'transparent transparent #ECECF8 transparent',
    },
  },
  container: {
    width: `${1220 + 2 * 16}px`,
    maxWidth: '100%',
    padding: '24px 16px 32px 16px',
    margin: '0 auto',
  },
  title: {
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '40px',
    color: '#5952B4',
    margin: '0 0 32px 0',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0 -12px -24px -12px',
  },
  column: {
    padding: '0 12px 24px 12px',
    width: '100%',
    flexBasis: '100%',
    flexShrink: '0',
    flexGrow: '1',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      flexBasis: '50%',
    },
    [theme.breakpoints.up('md')]: {
      width: '25%',
      flexBasis: '25%',
    },
  },
  card: {
    padding: '32px',
    borderRadius: '12px',
    height: '100%',
    background: '#ECECF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chain: {
    width: '100%',
    height: '44px',
    maxHeight: '100%',
  },
  chainInactive: {
    '& path:not(.nochange)': {
      fill: '#C6C6EC',
    },
  },
});

export default styles;

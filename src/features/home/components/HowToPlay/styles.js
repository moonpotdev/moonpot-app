const styles = theme => ({
  howToPlay: {
    background: '#ECECF8',
    textAlign: 'center',
    '&::after': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '0 0 3vw 100vw',
      borderColor: 'transparent transparent #CDCDE4 transparent',
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
    fontSize: '30px',
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
    [theme.breakpoints.up('md')]: {
      width: '33.3333%',
      flexBasis: '33.3333%',
    },
  },
  card: {
    padding: '24px',
    borderRadius: '12px',
    height: '100%',
    background: '#5952B4',
  },
  cardImage: {},
  cardTitle: {
    fontSize: '22px',
    lineHeight: '21px',
    fontWeight: '700',
    letterSpacing: '0.6px',
    color: '#ffffff',
    margin: '16px 0 16px 0',
  },
  cardText: {
    fontSize: '13px',
    lineHeight: '24px',
    opacity: '0.75',
    color: '#ffffff',
    '& p:last-child': {
      marginBottom: 0,
    },
  },
});

export default styles;

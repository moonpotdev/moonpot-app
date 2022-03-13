const styles = theme => ({
  featuredPots: {
    background: '#D0D0E1',
    textAlign: 'center',
  },
  container: {
    width: `${1220 + 2 * 16}px`,
    maxWidth: '100%',
    padding: '24px 16px 48px 16px',
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
    textAlign: 'left',
  },
  column: {
    padding: '0 12px 24px 12px',
    width: '100%',
    flexBasis: '100%',
    flexShrink: '0',
    flexGrow: '1',
    '&:nth-child(2) > div': {
      animationDelay: '0.25s',
    },
    '&:nth-child(3) > div': {
      animationDelay: '0.5s',
    },
    [theme.breakpoints.up('md')]: {
      width: '33.3333%',
      flexBasis: '33.3333%',
    },
  },
});

export default styles;

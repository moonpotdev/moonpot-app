const styles = theme => ({
  featuredPots: {
    background: '#E5E5E5',
    textAlign: 'center',
  },
  container: {
    width: `${1220 + 2 * 16}px`,
    maxWidth: '100%',
    padding: '48px 16px 56px 16px',
    margin: '0 auto',
  },
  title: {
    textTransform: 'uppercase',
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
    '&:nth-child(2) $placeholder': {
      animationDelay: '0.25s',
    },
    '&:nth-child(3) $placeholder': {
      animationDelay: '0.5s',
    },
    [theme.breakpoints.up('md')]: {
      width: '33.3333%',
      flexBasis: '33.3333%',
    },
  },
  card: {
    padding: '24px',
    borderRadius: '12px',
    height: '100%',
    backgroundImage: 'linear-gradient(105.09deg, #3D7AB8 0.63%, #478FD1 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  cardText: {
    marginRight: '16px',
  },
  cardWin: {
    fontWeight: '700',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#EBF3F9',
    marginBottom: '16px',
    '& span': {
      color: '#F3BA2E',
    },
  },
  cardImage: {
    width: '80px',
    flexBasis: '80px',
    flexGrow: '0',
    flexShrink: '1',
    marginLeft: 'auto',
    '& img': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  cardBottom: {
    marginTop: 'auto',
  },
  placeholder: {
    animationName: '$fadeInOut',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    opacity: 0.75,
  },
  placeholderButton: {
    borderRadius: '8px',
    height: '48px',
    background: '#FFF',
  },
  '@keyframes fadeInOut': {
    '0%': {
      opacity: 0.75,
    },
    '50%': {
      opacity: 0.25,
    },
    '100%': {
      opacity: 0.75,
    },
  },
  pot: {
    opacity: 1,
  },
});

export default styles;

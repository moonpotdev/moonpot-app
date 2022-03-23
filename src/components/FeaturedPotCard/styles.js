const styles = theme => ({
  card: {
    padding: '24px',
    borderRadius: '12px',
    height: '100%',
    backgroundImage: 'linear-gradient(105.09deg, #4139AC 0.63%, #615DA9 100%, #615DA9 100%)',
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

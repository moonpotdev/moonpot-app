const styles = () => ({
  icon: {
    width: '24px',
    height: '24px',
  },
  lp: {
    position: 'relative',
    '& img': {
      position: 'absolute',
      width: '15px',
      height: '15px',
      '&:first-child': {
        zIndex: 2,
        left: 0,
        top: 0,
      },
      '&:last-child': {
        zIndex: 1,
        right: 0,
        bottom: 0,
      },
    },
  },
});

export default styles;

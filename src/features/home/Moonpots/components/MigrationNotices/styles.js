const styles = theme => ({
  notices: {
    maxWidth: '100%',
    marginBottom: '24px',
  },
  notice: {
    borderColor: '#4C4C80',
  },
  text: {
    marginBottom: '24px',
    '& p:first-child': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  link: {
    color: '#F3BA2E',
    '&:hover, &:active, &:focus': {
      color: '#F3BA2E',
    },
  },
});

export default styles;

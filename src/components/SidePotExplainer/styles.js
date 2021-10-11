const styles = theme => ({
  sidePotExplainer: {
    fontSize: '15px',
    '& span': {
      color: '#F3BA2E',
      textDecoration: 'underline',
      '& a': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
  },
  learnMore: {
    color: '#F3BA2E',
    textDecoration: 'none',
    marginTop: '16px',
    fontSize: '15px',
    '& .MuiSvgIcon-root': {
      verticalAlign: 'middle',
      marginLeft: '5px',
    },
  },
});

export default styles;

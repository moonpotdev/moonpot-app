const styles = theme => ({
  strategy: {
    '& p': {
      marginTop: '0',
      marginBottom: '1em',
    },
    '& p:last-child': {
      marginBottom: '0',
    },
  },
  nftRarities: {
    marginBottom: '1em',
  },
  nftRarityName: {
    fontWeight: 'bold',
  },
  link: {
    color: '#F3BA2E',
    textDecoration: 'none',
    '& .MuiSvgIcon-root': {
      verticalAlign: 'middle',
    },
  },
  earningItem: {
    '& + $earningItem': {
      marginTop: '16px',
    },
  },
  earningLabel: {
    fontSize: '10px',
    fontWeight: 'bold',
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  earningValue: {
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#FAFAFC',
  },
  fairplayRules: {
    '& p': {
      marginTop: '0',
      marginBottom: '1em',
    },
    '& p:last-child': {
      marginBottom: '0',
    },
  },
  ziggyTimelock: {
    marginBottom: '21px',
  },
  ziggyPlay: {
    marginTop: '32px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    width: '240px',
    maxWidth: '100%',
  },
});

export default styles;

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
  nftShowcase: {
    marginBottom: '1em',
    justifyContent: 'flex-start',
  },
  nftShowcaseItem: {
    textAlign: 'left',
  },
  nftShowcaseImg: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
  nftShowcaseItemName: {
    marginTop: '8px',
    fontWeight: 'bold',
  },
  merchShowcase: {
    marginBottom: '1em',
    textAlign: 'center',
    '& figure': {
      padding: '0',
      margin: '0',
      width: '100%',
      display: 'block',
    },
    '& img': {
      maxWidth: '100%',
    },
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
    fontSize: '8px',
    fontWeight: 'bold',
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  earningValue: {
    fontWeight: 'bold',
    fontSize: '13px',
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

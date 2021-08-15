const styles = theme => ({
  rowLogoWinTotal: {
    marginBottom: `${24 - 8}px`,
  },
  title: {
    color: '#EBF3F9',
    fontSize: '19px',
    lineHeight: '28px',
    fontWeight: '500',
    textAlign: 'right',
    letterSpacing: '0.6px',
  },
  winTotalPrize: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '0.6px',
    '& > span': {
      color: '#F3BA2E',
    },
  },
  winTotalTokens: {
    textAlign: 'right',
    color: '#FAFAFC',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    '& > span': {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  },
});

export default styles;

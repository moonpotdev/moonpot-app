const styles = theme => ({
  rowLogoWonTotal: {
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
  valueWon: {
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
  wonTotalTokens: {
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
  userWonPrize: {
    display: 'flex',
    flexDirection: 'row',
    background: '#FAF9FB',
    border: '2px solid #E3DFEC',
    borderRadius: '4px',
    color: '#000000',
    fontSize: '12px',
    lineHeight: '20px',
    padding: '10px',
    marginBottom: `20px`,
  },
  userWonPrizeIcon: {
    color: '#008F39',
    fontSize: '20px',
    flexShrink: '0',
  },
  userWonPrizeText: {
    marginLeft: '10px',
  },
  rowDrawStats: {
    justifyContent: 'flex-start',
    marginBottom: `${20 - 8}px`,
    '& > .MuiGrid-item:nth-child(even)': {
      textAlign: 'right',
    },
  },
  perWinnerToken: {
    color: '#F3BA2E',
  },
  perWinnerValue: {
    fontWeight: 'normal',
  },
  rowWinners: {
    justifyContent: 'flex-start',
    marginBottom: `${16 - 8}px`,
  },
  winnerAddress: {
    fontSize: '10px',
    fontWeight: 'bold',
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  winnerStaked: {
    fontSize: '12px',
    fontWeight: 'bold',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#FFFFFF',
  },
  txLink: {
    color: '#F3BA2E',
    textDecoration: 'none',
  },
});

export default styles;

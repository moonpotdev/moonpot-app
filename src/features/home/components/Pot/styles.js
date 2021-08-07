const styles = (theme) => ({
  rowLogoWinTotal: {
    marginBottom: `${24 - 8}px`,
  },
  winTotal: {
    color: '#EBF3F9',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'right',
  },
  winTotalPrize: {
    fontSize: '24px',
    lineHeight: '28px',
    letterSpacing: '0.6px',
  },
  winTotalPrizeAmount: {
    '& > span': {
      color: '#F3BA2E',
      fontWeight: 'bold',
    },
  },
  winTokenPrizeTokens: {
    '& > span': {
      color: '#FAFAFC',
      fontWeight: 'bold',
    },
  },
  winTotalNote: {
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
  },
  rowDrawStats: {
    justifyContent: 'flex-start',
    marginBottom: `${20 - 8}px`,
    '& > .MuiGrid-item:nth-child(even)': {
      textAlign: 'right',
    },
  },
  statLabel: {
    color: '#EBF3F9',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFFFFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    '& > span': {
      fontWeight: 'normal',
      color: '#A0BBD5',
      textDecoration: 'line-through',
    }
  },
  prizeSplitValue: {
    textAlign: 'right',
    '& > span': {
      fontWeight: 'bold',
    }
  },
  rowPlay: {
    marginTop: '20px',
  },
  rowOdds: {
    marginTop: '8px',
    textAlign: 'center',
    fontWeight: '300',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#FFFFFF',
  }
});

export default styles;
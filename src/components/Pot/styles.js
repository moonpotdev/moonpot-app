const styles = theme => ({
  rowLogoWinTotal: {
    marginBottom: `${24 - 8}px`,
    flexWrap: 'nowrap',
  },
  columnTitleWinTotal: {
    flexGrow: '1',
  },
  network: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 34,
    height: 34,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'inherit',
    borderBottomRightRadius: '16px',
    borderTopLeftRadius: '16px',
    '& img': {
      position: 'relative',
      zIndex: 1,
      width: 24,
      height: 24,
      marginLeft: (30 - 24) / 2,
      marginTop: (30 - 24) / 2,
    },
  },
  networkBsc: {
    backgroundColor: '#efb90c',
  },
  networkPolygon: {
    backgroundColor: '#8247e4',
  },
  networkFantom: {
    backgroundColor: '#1969FF',
  },
  title: {
    color: '#EBF3F9',
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '500',
    textAlign: 'right',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
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
  rowDrawStats: {
    justifyContent: 'flex-start',
    marginBottom: `${20 - 8}px`,
    '& > .MuiGrid-item:nth-child(even)': {
      textAlign: 'right',
    },
  },
  statLabel: {
    color: '#EBF3F9',
  },
  statValue: {
    '& > span': {
      fontWeight: 'normal',
      color: '#A0BBD5',
      textDecoration: 'line-through',
    },
  },
  depositOdds: {
    fontSize: '12px',
    fontWeight: '400',
    '& span': {
      fontWeight: '700',
    },
  },
  interestValueApy: {
    color: '#F3BA2E',
  },
  interestValueBaseApy: {
    fontWeight: 'normal',
    color: '#A0BBD5',
    textDecoration: 'line-through',
  },
  interestValueApr: {
    fontWeight: 'normal',
  },
  prizeSplitToken: {
    '& span': {
      fontWeight: 'bold',
      color: '#ffffff',
    },
  },
  prizeSplitTotal: {
    '& span': {
      fontWeight: 'bold',
      color: '#F3BA2E',
    },
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
  },
  themeXmas: {
    borderColor: 'red',
  },
});

export default styles;

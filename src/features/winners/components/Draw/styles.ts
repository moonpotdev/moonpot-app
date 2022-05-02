import { Theme } from '@material-ui/core';

const styles = (theme: Theme) => ({
  rowLogoWonTotal: {
    marginBottom: `${24 - 8}px`,
    flexWrap: 'nowrap' as const,
  },
  title: {
    color: '#EBF3F9',
    fontSize: '19px',
    lineHeight: '28px',
    fontWeight: 500,
    textAlign: 'right' as const,
    letterSpacing: '0.6px',
  },
  valueWon: {
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
    textAlign: 'right' as const,
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '0.6px',
    '& > span': {
      color: '#F3BA2E',
    },
  },
  columnTitleValueWon: {
    flexGrow: 1,
  },
  wonTotalTokens: {
    textAlign: 'right' as const,
    color: '#FAFAFC',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    '& > span': {
      color: '#FFFFFF',
      fontWeight: 'bold' as const,
    },
  },
  userWonPrize: {
    display: 'flex',
    flexDirection: 'row' as const,
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
    flexShrink: 0,
  },
  userWonPrizeText: {
    marginLeft: '10px',
  },
  rowDrawStats: {
    justifyContent: 'flex-start',
    marginBottom: `${20 - 8}px`,
    '& > .MuiGrid-item:nth-child(even)': {
      textAlign: 'right' as const,
    },
  },
  perWinnerToken: {
    color: '#F3BA2E',
  },
  perWinnerValue: {
    fontWeight: 'normal' as const,
  },
  rowWinners: {
    justifyContent: 'flex-start',
    marginBottom: `${16 - 8}px`,
  },
  winnerAddress: {
    fontSize: '10px',
    fontWeight: 'bold' as const,
    lineHeight: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  winnerStaked: {
    fontSize: '12px',
    fontWeight: 'bold' as const,
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#FFFFFF',
  },
  txLink: {
    color: '#F3BA2E',
    textDecoration: 'none',
  },
  network: {
    position: 'absolute' as const,
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
      position: 'relative' as const,
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
});

export default styles;

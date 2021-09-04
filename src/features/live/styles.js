const styles = theme => ({
  rowLogoTitle: {
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
  winTotal: {
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
  countdown: {
    fontSize: '24px',
    textAlign: 'center',
  },
  drawStatus: {
    fontSize: '24px',
    textAlign: 'center',
  },
  winners: {
    marginTop: '16px',
    marginBottom: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderTop: 'solid 2px #70609A',
    borderBottom: 'solid 2px #70609A',
    '& $winner + $winner': {
      marginTop: '10px',
    },
  },
  winner: {},
  winnerAddress: {},
  winnings: {
    color: '#FFFFFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
  },
  txLink: {
    textAlign: 'center',
    display: 'block',
  },
  token: {
    color: '#F3BA2E',
  },
  value: {},
});

export default styles;

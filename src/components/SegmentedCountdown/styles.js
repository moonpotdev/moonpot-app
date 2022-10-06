const styles = theme => ({
  countdown: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    textAlign: 'center',
    color: '#fff',
  },
  countdownPart: {
    display: 'flex',
    flexDirection: 'column',
  },
  countdownBox: {
    fontSize: '22px',
    lineHeight: `${40 - 2 * 2}px`,
    letterSpacing: '0.6px',
    fontWeight: '700',
    border: 'solid 2px #F3BA2E',
    borderRadius: '4px',
    width: '48px',
    height: '40px',
  },
  countdownLabel: {
    fontWeight: '700',
    fontSize: '8px',
    lineHeight: '20px',
    letterSpacing: '1px',
    marginTop: '2px',
    textTransform: 'uppercase',
  },
  countdownSep: {
    fontSize: '22px',
    lineHeight: '40px',
    padding: '0 8px',
  },
});

export default styles;

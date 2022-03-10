const styles = theme => ({
  wrapper: {
    background: 'linear-gradient(90.18deg, #B8632E 0.12%, #CF8950 75.41%, #D6955C 100%)',
    width: '100%',
    height: '84px',
  },
  tickerContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: '100%',
  },
  tickerItemWrapper: {
    display: 'flex',
    height: '100%',
    padding: '20px 32px',
    flexDirection: 'column',
  },
  title: {
    fontSize: '10px',
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    lineHeight: '20px',
  },
  content: {
    fontSize: '15px',
    color: '#fff',
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: '24px',
  },
});

export default styles;

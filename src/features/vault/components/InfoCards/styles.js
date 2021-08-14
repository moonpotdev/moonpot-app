const styles = theme => ({
  ziggyTimelock: {
    paddingBottom: '20px',
  },
  infoTitle: {
    color: '#FAFAFC',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: '0.6px',
    marginBottom: '16px',
  },
  infoSubHeader: {
    color: '#EBF3F9',
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: '16px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  infoMessage: {
    color: '#D9D9E8',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.2px',
  },
  infoDetail: {
    color: '#FAFAFC',
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '24px',
    paddingTop: '5px',
    paddingBottom: '20px',
    '& span': {
      textDecoration: 'line-through',
    },
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

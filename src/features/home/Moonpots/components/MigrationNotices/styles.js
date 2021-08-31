const styles = theme => ({
  notices: {
    maxWidth: '100%',
  },
  notice: {
    backgroundColor: '#FFFFFF',
    width: '500px',
    maxWidth: '100%',
    border: '2px solid #F3F2F8',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
    boxSizing: 'border-box',
    margin: '0 auto 24px auto',
    padding: '24px',
  },
  text: {
    position: 'relative',
    fontSize: '12px',
    color: '#333333',
    paddingLeft: 20 + 10,
    '& p': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  alertIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
  },
  button: {
    backgroundColor: 'rgba(103, 83, 219, 0.1)',
    border: '2px solid #6753DB',
    boxSizing: 'border-box',
    borderRadius: '20px',
    width: '100%',
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '17px',
    color: '#6753DB',
    marginTop: 24,
  },
  link: {
    color: '#6753DB',
    '&:hover, &:active, &:focus': {
      color: '#4631dc',
    },
  },
});

export default styles;

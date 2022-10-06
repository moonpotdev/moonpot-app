const styles = theme => ({
  block: {
    backgroundColor: '#FFFFFF',
    maxWidth: '100%',
    height: '100%',
    border: '2px solid #F3F2F8',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '24px',
    width: '500px',
  },
  text: {
    position: 'relative',
    fontSize: '13px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#333333',
    marginTop: '24px',
    minHeight: '48px',
    '& p': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  button: {
    backgroundColor: 'rgba(103, 83, 219, 0.1)',
    border: '2px solid #6753DB',
    boxSizing: 'border-box',
    borderRadius: '20px',
    width: '100%',
    fontSize: '13px',
    lineHeight: '17px',
    fontWeight: '500',
    color: '#6753DB',
    marginTop: '24px',
    textTransform: 'none',
  },
  image: {
    margin: '0 auto',
    display: 'block',
    width: '64px',
    height: '64px',
  },
  link: {
    textDecoration: 'none',
  },
});

export default styles;

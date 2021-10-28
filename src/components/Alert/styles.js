const styles = theme => ({
  alert: {
    display: 'flex',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '4px',
    padding: '12px',
  },
  icon: {
    width: 20,
    marginRight: 8,
    flex: '0 0 20px',
    fontSize: '20px',
  },
  title: {
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '20px',
    letterSpacing: '0.6px',
    marginBottom: 12,
  },
  text: {
    color: 'inherit',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    '& p': {
      color: 'inherit',
      fontStyle: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      marginTop: '8px',
      marginBottom: '8px',
    },
    '& p:first-child': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  variantPurpleLight: {
    color: '#fff',
    backgroundColor: '#6D608F',
    borderColor: '#7A6D9D',
    '& $text': {
      color: '#fff',
      '& a': {
        color: '#F3BA2E',
      },
    },
  },
});

export default styles;

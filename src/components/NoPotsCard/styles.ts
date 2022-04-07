const styles = () => ({
  card: {
    textAlign: 'center' as const,
    width: '100%',
    background: '#424270',
    border: '2px solid #4C4C80',
    borderRadius: '16px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px rgba(0, 0, 0, 0.4);',
    padding: '24px',
  },
  ziggy: {
    marginBottom: '24px',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    lineHeight: '36px',
    fontWeight: 400,
    margin: '0 0 12px 0',
  },
  text: {
    fontSize: '15px',
    color: '#fff',
    lineHeight: '24px',
    margin: '0 0 24px 0',
    '& p:first-child': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;

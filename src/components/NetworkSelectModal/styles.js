const styles = theme => ({
  networks: {
    display: 'flex',
    flexDirection: 'column',
  },
  network: {
    padding: '0',
    margin: '0',
    boxShadow: 'none',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ffffff',
    fontSize: '18px',
    lineHeight: '32px',
    '& + $network': {
      marginTop: '12px',
    },
  },
  icon: {
    marginRight: '16px',
    '& img': {
      display: 'block',
    },
  },
});

export default styles;

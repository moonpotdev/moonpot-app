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
    lineHeight: '1',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ffffff',
    '& + $network': {
      marginTop: '8px',
    },
  },
  icon: {
    marginRight: '12px',
  },
});

export default styles;

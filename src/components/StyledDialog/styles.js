const styles = theme => ({
  dialogPaper: {
    background: '#303050',
    color: '#D9D9D9',
  },
  titleRoot: {
    background: '#262640',
    color: '#ffffff',
    borderBottom: 'solid 2px #4C4C80',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
  },
  titleText: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '0.6px',
    lineHeight: 1,
  },
  titleClose: {
    marginLeft: '24px',
    padding: '0',
    margin: '0',
    boxShadow: 'none',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    lineHeight: '1',
    display: 'block',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    '& .MuiSvgIcon-root': {
      fill: '#8585AD',
    },
  },
  contentRoot: {
    padding: '24px',
    color: '#D9D9D9',
  },
});

export default styles;

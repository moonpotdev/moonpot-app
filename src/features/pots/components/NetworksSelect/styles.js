const styles = theme => ({
  box: {
    border: '2px solid #555590',
    borderRadius: '8px',
    display: 'flex',
    padding: `${12 - 2}px ${24 - 2}px`,
    width: 'fit-content',
  },
  label: {
    width: '24px',
    height: '24px',
    display: 'block',
    position: 'relative',
    cursor: 'pointer',
    '& + $label': {
      marginLeft: '12px',
    },
  },
  checkbox: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
    '&:not(:checked) + $icon': {
      '& .network-fg': {
        fill: '#393960',
      },
      '& .network-bg': {
        fill: '#555590',
      },
    },
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '24px',
    height: '24px',
  },
});

export default styles;

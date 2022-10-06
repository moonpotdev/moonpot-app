import { Theme } from '@material-ui/core';

const styles = (theme: Theme) => ({
  group: {
    border: 'solid 2px #555590',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row' as const,
    width: 'fit-content',
    backgroundColor: '#393960',
  },
  button: {
    border: 'none',
    borderRadius: '8px',
    padding: `${12 - 2}px ${24 - 2}px`,
    color: '#ffffff',
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '24px',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: 'none',
    flexGrow: 1,
    flexShrink: 0,
    '&:hover': {
      backgroundColor: '#303050',
    },
  },
  selected: {
    margin: '-2px',
    border: 'solid 2px #F3BA2E',
    backgroundColor: '#303050',
    position: 'relative' as const,
    zIndex: 1,
  },
});

export default styles;

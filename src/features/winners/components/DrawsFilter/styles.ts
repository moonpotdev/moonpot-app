import { Theme } from '@material-ui/core';

const styles = (theme: Theme) => ({
  bar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    rowGap: '8px',
    columnGap: '24px',
  },
  mode: {
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  networks: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'space-around' as const,
    },
  },
  pots: {
    minWidth: '230px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

export default styles;

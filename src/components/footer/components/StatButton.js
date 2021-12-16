import { Grid, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import styles from './styles';
//import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

const StatButton = ({ label, value }) => {
  //const { t } = useTranslation();
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container className={classes.statContianer}>
        <Grid>
          <Typography className={classes.statTitle}>{label}</Typography>
        </Grid>
        <Grid>
          <Typography className={classes.statValue}>{value}</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default StatButton;

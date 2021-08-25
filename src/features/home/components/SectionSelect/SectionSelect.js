import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import { Grid, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

const SectionSelect = ({ config, setConfig }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (name, value) => {
      setConfig({ ...config, [name]: value });
      console.log('Set config: ' + value);
    },
    [setConfig, config]
  );

  return (
    <React.Fragment>
      <Grid container className={classes.buttonsContainer}>
        <Grid item xs={6}>
          <Button
            className={config.selected === 'moonpots' ? classes.buttonSelected : classes.button}
            onClick={() => handleChange('selected', 'moonpots')}
          >
            {t('buttons.moonpots')}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            className={config.selected === 'myPots' ? classes.buttonSelected : classes.button}
            onClick={() => handleChange('selected', 'myPots')}
          >
            {t('buttons.myPots')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SectionSelect;

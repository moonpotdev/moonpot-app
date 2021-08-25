import React, { useCallback, useEffect } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const useStyles = makeStyles(styles);

const Filter = ({ config, setConfig, className, selected }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleChange = useCallback(
    (name, value) => {
      setConfig({ ...config, [name]: value });
    },
    [setConfig, config]
  );

  useEffect(() => {
    if (selected === 'community') {
      setConfig({ ...config, vault: 'community' });
    }
  }, []);

  return (
    <Grid container className={classes.buttonContainer}>
      <Grid item xs={6}>
        <Button
          className={config.vault === 'main' ? classes.buttonActive : classes.button}
          onClick={() => handleChange('vault', 'main')}
        >
          {t('buttons.mainPots')}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          className={config.vault === 'community' ? classes.buttonActive : classes.button}
          onClick={() => handleChange('vault', 'community')}
        >
          {t('buttons.communityPots')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filter;

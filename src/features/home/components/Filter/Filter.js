import React, { useCallback } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const Filter = ({ config, setConfig, className }) => {
  const { t } = useTranslation();

  const handleChange = useCallback((name, value) => {
    setConfig({ ...config, [name]: value });
  }, [setConfig, config]);

  return (
    <Grid container spacing={2} className={clsx(className)}>
      <Grid item>
        <Button variant={'outlined'} color={config.vault === 'main' ? 'primary' : 'default'}
                onClick={() => handleChange('vault', 'main')}>{t('buttons.mainPots')}</Button>
      </Grid>
      <Grid item>
        <Button variant={'outlined'} color={config.vault === 'community' ? 'primary' : 'default'}
                onClick={() => handleChange('vault', 'community')}>{t('buttons.communityPots')}</Button>
      </Grid>
    </Grid>
  );
};

export default Filter;

import React, { useCallback } from 'react';
import {Button, Grid} from '@material-ui/core';
import {useTranslation} from "react-i18next";

const Filter = ({config, setConfig}) => {
    const { t } = useTranslation();

    const handleChange = useCallback((name, value) => {
        setConfig({ ...config, [name]: value });
    }, [setConfig, config]);

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant={"outlined"} color={config.vault === 'main' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'main')}>{t('buttons.mainPots')}</Button>
                </Grid>
                <Grid item>
                    <Button variant={"outlined"} color={config.vault === 'community' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'community')}>{t('buttons.communityPots')}</Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Filter;

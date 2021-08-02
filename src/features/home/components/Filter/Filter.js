import React from "react";
import {Box, Button, Grid} from '@material-ui/core';
import {useTranslation} from "react-i18next";

const Filter = ({sortConfig, setSortConfig, defaultFilter}) => {
    const { t } = useTranslation();

    const handleChange = (name, value) => {
        setSortConfig({ ...sortConfig, [name]: value });
    };

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant={"outlined"} color={sortConfig.vault === 'main' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'main')}>{t('buttons.mainPots')}</Button>
                </Grid>
                <Grid item>
                    <Button variant={"outlined"} color={sortConfig.vault === 'community' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'community')}>{t('buttons.communityPots')}</Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Filter;

import React from "react";
import {Box, Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const Filter = ({sortConfig, setSortConfig, defaultFilter}) => {
    const { t } = useTranslation();

    const handleChange = (name, value) => {
        setSortConfig({ ...sortConfig, [name]: value });
    };

    return (
        <React.Fragment>
            <Box display="flex" justifyContent="center">
                <Box p={1}>
                    <Button variant={"outlined"} color={sortConfig.vault === 'main' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'main')}>{t('buttons.mainPots')}</Button>
                </Box>
                <Box p={1}>
                    <Button variant={"outlined"} color={sortConfig.vault === 'community' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'community')}>{t('buttons.communityPots')}</Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Filter;

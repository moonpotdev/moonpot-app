import React from "react";
import {Box, Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const Filter = ({sortConfig, setFilter}) => {
    const { t } = useTranslation();
    const [state, setState] = React.useState({
        key: sortConfig.key,
        deposited: sortConfig.deposited,
        vault: sortConfig.vault,
    });

    const handleChange = (name, value) => {
        setState({ ...state, [name]: value });
    };

    React.useEffect(() => {
        setFilter(state);
    }, [state]);

    return (
        <React.Fragment>
            <Box display="flex">
                <Box p={1}>
                    <Button variant={"outlined"} color={state.vault === 'main' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'main')}>{t('buttons.mainPots')}</Button>
                </Box>
                <Box p={1}>
                    <Button variant={"outlined"} color={state.vault === 'community' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'community')}>{t('buttons.communityPots')}</Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Filter;

import React from "react";
import {Box, Button} from "@material-ui/core";

const Filter = ({sortConfig, setFilter}) => {

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
                    <Button variant={"outlined"} color={state.vault === 'main' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'main')}>Main Pots</Button>
                </Box>
                <Box p={1}>
                    <Button variant={"outlined"} color={state.vault === 'community' ? 'primary' : 'default'} onClick={() => handleChange('vault', 'community')}>Community Pots</Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Filter;

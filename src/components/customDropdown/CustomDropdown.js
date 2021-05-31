import * as React from "react";
import {makeStyles, Box, MenuItem, Select, Typography,} from "@material-ui/core";
import styles from "./styles"

const useStyles = makeStyles(styles);

const CustomDropdown = ({list, selected, handler, name, label, css}) => {
    const classes = useStyles();

    return (
        <Box className={classes.selectWrapper} style={css}>
            {label && selected === 'all' ? (<Typography>{label}</Typography>) : ''}
            <Select value={selected} name={name} onChange={handler}>
                {Object.keys(list).map(val => (
                    <MenuItem key={list[val]} value={val}>{list[val]}</MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default CustomDropdown;

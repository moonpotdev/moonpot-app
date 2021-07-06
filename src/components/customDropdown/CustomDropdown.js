import * as React from "react";
import {makeStyles, Box, MenuItem, Select, Typography,} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from "./styles"

const useStyles = makeStyles(styles);

const iconComponent = (props) => {
    return (
        <ExpandMoreIcon className={props.className + " " + useStyles.icon}/>
    )
};

const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
        horizontal: "left"
    },
    getContentAnchorEl: null
  };

const CustomDropdown = ({list, selected, handler, name, label, css}) => {
    const classes = useStyles();

    return (
        <Box className={classes.selectWrapper} style={css}>
            {label && selected === 'all' ? (<Typography>{label}</Typography>) : ''}
            <Select 
                disableUnderline
                MenuProps={menuProps}
                IconComponent={iconComponent}
                value={selected} 
                name={name} 
                onChange={handler}
                
            >
                {Object.keys(list).map(val => (
                    <MenuItem key={list[val]} value={val}>{list[val]}</MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default CustomDropdown;

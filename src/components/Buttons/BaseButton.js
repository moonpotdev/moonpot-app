import { Button, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { forwardRef, useCallback } from 'react';

const RoutedButton = forwardRef(function ({ to, ...rest }, ref) {
  const history = useHistory();
  const handleClick = useCallback(
    e => {
      if (to) {
        e.preventDefault();
        history.push(to);
      }
    },
    [history, to]
  );

  return <Button ref={ref} onClick={to ? handleClick : null} {...rest} />;
});

const VariantButton = forwardRef(function ({ variant, ...rest }, ref) {
  return <RoutedButton ref={ref} {...rest} />;
});

export const BaseButton = withStyles(theme => ({
  '@keyframes enter': {
    '0%': {
      transform: 'scale(0)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  root: {
    height: '48px',
    borderRadius: '8px',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '15px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover, &:focus': {
      boxShadow: 'none',
    },
    '& .MuiTouchRipple-rippleVisible': {
      opacity: 1,
      animation: `$enter 550ms ${theme.transitions.easing.easeInOut}`,
    },
  },
  label: {
    position: 'relative',
    zIndex: '10',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    color: '#888888',
    borderColor: '#CCCCCC',
  },
}))(VariantButton);

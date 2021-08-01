import { Button, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { forwardRef, useCallback } from 'react';

const RoutedButton = forwardRef(function ({ to, ...rest }, ref) {
  const history = useHistory();
  const handleClick = useCallback(() => {
    if (to) {
      history.push(to);
    }
  }, [history, to]);

  return <Button ref={ref} onClick={to ? handleClick : null} {...rest} />;
});

export const BaseButton = withStyles({
  root: {
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
    display: 'block',
    padding: 12,
    height: 'auto',
    textAlign: 'center',
  },
})(RoutedButton);

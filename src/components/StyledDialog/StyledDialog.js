import { memo } from 'react';
import { Dialog, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles';

const useStyles = makeStyles(styles);

export const StyledDialog = memo(function StyledDialog({ children, ...rest }) {
  const classes = useStyles();
  return (
    <Dialog classes={{ paper: classes.dialogPaper }} {...rest}>
      {children}
    </Dialog>
  );
});

export const StyledDialogTitle = memo(function StyledDialogTitle({
  handleClose,
  children,
  ...rest
}) {
  const classes = useStyles();
  return (
    <DialogTitle classes={{ root: classes.titleRoot }} disableTypography={true} {...rest}>
      <div className={classes.titleText}>{children}</div>
      {handleClose ? (
        <button className={classes.titleClose} onClick={handleClose}>
          <CloseIcon />
        </button>
      ) : null}
    </DialogTitle>
  );
});

export const StyledDialogContent = memo(function StyledDialogContent({ children, ...rest }) {
  const classes = useStyles();
  return (
    <DialogContent classes={{ root: classes.contentRoot }} {...rest}>
      {children}
    </DialogContent>
  );
});

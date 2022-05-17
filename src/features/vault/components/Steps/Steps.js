import { Box, Button, Grid, Link, makeStyles, Modal, Typography } from '@material-ui/core';
import React, { memo, useEffect } from 'react';
import { OpenInNew, ErrorOutline, Close } from '@material-ui/icons';
import { isEmpty } from '../../../../helpers/utils';
import styles from '../../styles';
import { useSelector } from 'react-redux';
import { networkById } from '../../../../config/networks';
import { Translate } from '../../../../components/Translate';

const useStyles = makeStyles(styles);

const Steps = ({ item, steps, handleClose }) => {
  const classes = useStyles();
  const action = useSelector(state => state.wallet.action);
  const renderContent = steps.modal && item;

  const calcProgressPosition = () => {
    if (steps.finished) {
      return '100%';
    } else if (
      action.result === 'success_pending' &&
      steps.currentStep === steps.items.length - 1
    ) {
      return '75%';
    } else if (steps.items.length === 2 && steps.currentStep === 0) {
      return '25%';
    } else {
      return '50%';
    }
  };

  const calcProgressBorders = () => {
    if (steps.finished) {
      return '4px 4px 0 0';
    } else {
      return '4px 0 0 0';
    }
  };

  const getSuccessTitle = data => {
    if (data === 'deposit') {
      return 'txModal.depositSuccess';
    } else if (data === 'withdraw') {
      return 'txModal.withdrawSuccess';
    } else if (data === 'reward') {
      return 'txModal.rewardSuccess';
    } else if (data === 'compound') {
      return 'txModal.compoundSuccess';
    } else if (data === 'claimAll') {
      return 'txModal.claimSuccess';
    }
  };

  const getSuccessMessage = data => {
    if (data === 'deposit') {
      return 'txModal.depositConfirmed';
    } else if (data === 'withdraw') {
      return 'txModal.withdrawConfirmed';
    } else if (data === 'reward') {
      return 'txModal.rewardConfirmed';
    } else if (data === 'compound') {
      return 'txModal.compoundConfirmed';
    } else if (data === 'claimAll') {
      return 'txModal.claimConfirmed';
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={steps.modal}
      hideBackdrop={true}
      disableEnforceFocus={true}
      disableScrollLock={true}
    >
      <Box className={classes.modalForeground}>
        {renderContent && (
          <Grid container className={classes.modalText}>
            {/* Progress Bar */}
            <div className={classes.progressContainer}>
              {action && action.result === 'error' ? (
                <div className={classes.progressError} />
              ) : (
                <div
                  className={classes.progress}
                  style={{ width: calcProgressPosition(), borderRadius: calcProgressBorders() }}
                />
              )}
            </div>
            {steps.finished ? (
              <>
                {/* Confirmation Dialogs */}
                <Grid item>
                  <div className={classes.errorTitle}>
                    <div
                      id="transition-modal-title"
                      className={classes.transactionConfirmations}
                      style={{ margin: 0, padding: 0, paddingLeft: 8 }}
                    >
                      <div style={{ display: 'flex' }}>
                        <Translate
                          i18nKey={getSuccessTitle(steps.items[steps.currentStep].step)}
                          values={{ pot: item.name }}
                        />
                        <div onClick={handleClose} className={classes.closeBtn}>
                          <Close />
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.successArea}>
                    <Translate
                      i18nKey={getSuccessMessage(steps.items[steps.currentStep].step)}
                      values={{ pot: item.name }}
                    />
                    <br />
                    <Box style={{ marginTop: 16 }}>
                      <Link
                        className={classes.blockExplorerLink}
                        href={
                          networkById[item.network].explorerUrl +
                          '/tx/' +
                          action.data.receipt.transactionHash
                        }
                        target="_blank"
                      >
                        <Translate i18nKey="txModal.viewTransaction" />{' '}
                        <OpenInNew className={classes.linkIcon} />
                      </Link>
                    </Box>
                  </div>
                </Grid>
                <Button onClick={handleClose} className={classes.closeButton}>
                  <Translate i18nKey="txModal.close" />
                </Button>
              </>
            ) : (
              <>
                {action && action.result === 'error' ? (
                  <>
                    {/* Error Dialog */}
                    <Grid item>
                      <div className={classes.errorTitle}>
                        <ErrorOutline style={{ fill: '#DC2C10' }} />
                        <div
                          id="transition-modal-title"
                          className={classes.transactionConfirmations}
                          style={{ margin: 0, padding: 0, paddingLeft: 8 }}
                        >
                          <div style={{ display: 'flex' }}>
                            <Translate i18nKey="txModal.error" />
                            <div onClick={handleClose} className={classes.closeBtn}>
                              <Close />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.errorArea}>{action.data.error}</Typography>
                    </Grid>
                    <Button onClick={handleClose} className={classes.closeButton}>
                      <Translate i18nKey="txModal.close" />
                    </Button>
                  </>
                ) : action && action.result === 'success_pending' ? (
                  <>
                    {/* Txn awaiting confirmation */}
                    <Grid item>
                      <div id="transition-modal-title" className={classes.transactionConfirmations}>
                        <div style={{ display: 'flex' }}>
                          <Translate i18nKey="txModal.pending" />
                          <div onClick={handleClose} className={classes.closeBtn}>
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Typography
                      className={classes.confirmTransactionText}
                      id="transition-modal-description"
                    >
                      <Translate i18nKey="txModal.waitingForNetwork" />
                    </Typography>
                  </>
                ) : (
                  <>
                    {/* Standard x/x txn flow */}
                    <Grid item>
                      <div id="transition-modal-title" className={classes.transactionConfirmations}>
                        <div style={{ display: 'flex' }}>
                          {steps.currentStep}/{steps.items.length}{' '}
                          <Translate i18nKey={'txModal.confirmed'} />
                          <div onClick={handleClose} className={classes.closeBtn}>
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Typography
                      className={classes.confirmTransactionText}
                      id="transition-modal-description"
                    >
                      {!isEmpty(steps.items[steps.currentStep])
                        ? steps.items[steps.currentStep].message
                        : ''}
                    </Typography>
                  </>
                )}
              </>
            )}
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export const StepsProgress = memo(function StepsProgress({ steps, setSteps }) {
  const action = useSelector(state => state.wallet.action);

  useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
          }
        }
      }
    }
  }, [steps, setSteps, action]);

  return null;
});

export default Steps;

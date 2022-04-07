import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Link,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import React, { memo, useEffect } from 'react';
import { OpenInNew, ErrorOutline, Close } from '@material-ui/icons';
import { isEmpty } from '../../../../helpers/utils';
import Loader from '../../../../components/loader';
import styles from '../../styles';
import { useSelector } from 'react-redux';
import { networkByKey } from '../../../../config/networks';
import { Translate } from '../../../../components/Translate';

const useStyles = makeStyles(styles);

const Steps = ({ item, steps, handleClose }) => {
  const classes = useStyles();
  const action = useSelector(state => state.wallet.action);
  const renderContent = steps.modal && item;

  const calcProgressPosition = () => {
    if (steps.finished) {
      return '100%';
    } else if (action.result === 'success_pending') {
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
    } else if (data === 'withdraw' || data === 'reward') {
      return 'txModal.withdrawSuccess';
    } else if (data === 'compound') {
      return 'txModal.compoundSuccess';
    } else if (data === 'claimAll') {
      return 'txModal.claimSuccess';
    }
  };

  const getSuccessMessage = data => {
    if (data === 'deposit') {
      return 'txModal.depositConfirmed';
    } else if (data === 'withdraw' || data === 'reward') {
      return 'txModal.withdrawConfirmed';
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
      closeAfterTransition
      hideBackdrop={true}
      disableEnforceFocus={true}
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
                    <Typography
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
                    </Typography>
                  </div>
                </Grid>
                <Grid item>
                  <Typography className={classes.successArea}>
                    <Translate
                      i18nKey={getSuccessMessage(steps.items[steps.currentStep].step)}
                      values={{ pot: item.name }}
                    />
                    <br />
                    <Box style={{ marginTop: 16 }}>
                      <Link
                        className={classes.blockExplorerLink}
                        href={
                          networkByKey[item.network].explorerUrl +
                          '/tx/' +
                          action.data.receipt.transactionHash
                        }
                        target="_blank"
                      >
                        View transaction <OpenInNew className={classes.linkIcon} />
                      </Link>
                    </Box>
                  </Typography>
                </Grid>
                <Button onClick={handleClose} className={classes.closeButton}>
                  Close
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
                        <Typography
                          id="transition-modal-title"
                          className={classes.transactionConfirmations}
                          style={{ margin: 0, padding: 0, paddingLeft: 8 }}
                        >
                          <div style={{ display: 'flex' }}>
                            Transaction Error
                            <div onClick={handleClose} className={classes.closeBtn}>
                              <Close />
                            </div>
                          </div>
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.errorArea}>{action.data.error}</Typography>
                    </Grid>
                    <Button onClick={handleClose} className={classes.closeButton}>
                      Close
                    </Button>
                  </>
                ) : action && action.result === 'success_pending' ? (
                  <>
                    {/* Txn awaiting confirmation */}
                    <Grid item>
                      <Typography
                        id="transition-modal-title"
                        className={classes.transactionConfirmations}
                      >
                        <div style={{ display: 'flex' }}>
                          Confirmation Pending
                          <div onClick={handleClose} className={classes.closeBtn}>
                            <Close />
                          </div>
                        </div>
                      </Typography>
                    </Grid>
                    <Typography
                      className={classes.confirmTransactionText}
                      id="transition-modal-description"
                    >
                      Waiting for network to confirm transaction.
                    </Typography>
                  </>
                ) : (
                  <>
                    {/* Standard x/x txn flow */}
                    <Grid item>
                      <Typography
                        id="transition-modal-title"
                        className={classes.transactionConfirmations}
                      >
                        <div style={{ display: 'flex' }}>
                          {steps.currentStep}/{steps.items.length} Transactions Confirmed
                          <div onClick={handleClose} className={classes.closeBtn}>
                            <Close />
                          </div>
                        </div>
                      </Typography>
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
      {/* <Fade in={steps.modal}>
        <Box className={classes.modalForeground}>
          <Grid container className={classes.modalText}>
            <div className={classes.progressContainer}>
              <div className={classes.progress} />
            </div>
            {renderContent ? (
              steps.finished ? (
                <>
                  {steps.items[steps.currentStep].step === 'deposit' ? (
                    <React.Fragment>
                      <Typography className={classes.stepsTitleText}>Deposit Successful!</Typography>
                      <Typography className={classes.successfulDepositAmountText}>
                        You have successfully deposited into {item.name} Pot.
                      </Typography>
                    </React.Fragment>
                  ) : null}
                  {steps.items[steps.currentStep].step === 'withdraw' ? (
                    <React.Fragment>
                      <Typography className={classes.stepsTitleText}>Withdraw Successful!</Typography>
                      <Typography className={classes.successfulDepositAmountText}>
                        You have successfully withdrawn from {item.name} Pot.
                      </Typography>
                    </React.Fragment>
                  ) : null}
                  {steps.items[steps.currentStep].step === 'reward' ? (
                    <React.Fragment>
                      <Typography className={classes.stepsTitleText}>Withdraw Successful!</Typography>
                      <Typography className={classes.successfulDepositAmountText}>
                        You have successfully withdrawn all of your bonus earnings from {item.name}{' '}
                        Pot.
                      </Typography>
                    </React.Fragment>
                  ) : null}
                  {steps.items[steps.currentStep].step === 'compound' ? (
                    <React.Fragment>
                      <Typography className={classes.stepsTitleText}>Compound Successful!</Typography>
                      <Typography className={classes.successfulDepositAmountText}>
                        You have successfully compounded your bonus {item.token}
                      </Typography>
                    </React.Fragment>
                  ) : null}
                  {steps.items[steps.currentStep].step === 'claimAll' ? (
                    <React.Fragment>
                      <Typography className={classes.stepsTitleText}>Claim Successful!</Typography>
                      <Typography className={classes.successfulDepositAmountText}>
                        You have successfully claimed your bonus POTS
                      </Typography>
                    </React.Fragment>
                  ) : null}
                  <Box className={classes.viewMyMoonpots} textAlign={'center'}>
                    <Button href={'/#/my-moonpots'} onClick={handleClose}>
                      View My Moonpots
                    </Button>
                  </Box>
                  <Box textAlign={'center'}>
                    <Link
                      className={classes.blockExplorerLink}
                      href={
                        networkByKey[item.network].explorerUrl +
                        '/tx/' +
                        action.data.receipt.transactionHash
                      }
                      target="_blank"
                    >
                      See transaction on Block Explorer <OpenInNew />
                    </Link>
                  </Box>
                </>
              ) : (
                <React.Fragment>
                  <>
                    {action && action.result === 'error' ? (
                      <Alert severity={'error'}>
                        <AlertTitle>Error</AlertTitle>
                        <Typography>{action.data.error}</Typography>
                      </Alert>
                    ) : action && action.result === 'success_pending' ? (
                      <Alert severity={'info'}>
                        <AlertTitle className={classes.pendingText}>Confirmation Pending</AlertTitle>
                        <Typography className={classes.pendingText}>
                          Waiting for network to confirm transaction...
                        </Typography>
                        <Box textAlign={'center'}>
                          <Loader />
                        </Box>
                        <Box textAlign={'center'} mt={2}>
                          <Link
                            className={classes.blockExplorerLink}
                            href={networkByKey[item.network].explorerUrl + '/tx/' + action.data.hash}
                            target="_blank"
                          >
                            See transaction on Block Explorer <OpenInNew />
                          </Link>
                        </Box>
                      </Alert>
                    ) : (
                      <>
                        <Grid item>
                          <Typography
                            id="transition-modal-title"
                            className={classes.transactionConfirmations}
                          >
                            {steps.currentStep}/{steps.items.length} Transactions Confirmed
                          </Typography>
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
                  {/* <Button variant={'outlined'} onClick={handleClose}>
                    Close
                  </Button> /*...
                </React.Fragment>
              )
            ) : (
              <Box className={classes.modalForeground} />
            )}
          </Grid>
        </Box>
      </Fade> 
    */}
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

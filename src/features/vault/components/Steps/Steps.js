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
import { OpenInNew } from '@material-ui/icons';
import { isEmpty } from '../../../../helpers/utils';
import { Alert, AlertTitle } from '@material-ui/lab';
import Loader from '../../../../components/loader';
import styles from '../../styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

const Steps = ({ item, steps, handleClose }) => {
  const classes = useStyles();
  const wallet = useSelector(state => state.walletReducer);
  const renderContent = steps.modal && item;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={steps.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={steps.modal}>
        {renderContent ? (
          steps.finished ? (
            <Box className={classes.modalForeground}>
              <Grid container className={classes.modalText}>
                <Grid item xs={3}>
                  <img
                    alt="Moonpot Deposit"
                    className={classes.confirmationImage}
                    align={'left'}
                    src={require('../../../../images/ziggy/depositSuccessful.svg').default}
                  />
                </Grid>
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
                      wallet.explorer[item.network] +
                      '/tx/' +
                      wallet.action.data.receipt.transactionHash
                    }
                    target="_blank"
                  >
                    See transaction on Block Explorer <OpenInNew />
                  </Link>
                </Box>
              </Grid>
            </Box>
          ) : (
            <React.Fragment>
              <Box className={classes.modalForeground}>
                <Grid container className={classes.modalText}>
                  <Grid item xs={3}>
                    <img
                      alt="Moonpot Deposit"
                      className={classes.confirmationImage}
                      align={'left'}
                      src={require('../../../../images/ziggy/deposit.svg').default}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography
                      id="transition-modal-title"
                      className={classes.transactionConfirmations}
                    >
                      {steps.currentStep} / {steps.items.length} Transactions Confirmed
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

                  {wallet.action && wallet.action.result === 'error' ? (
                    <Alert severity={'error'}>
                      <AlertTitle>Error</AlertTitle>
                      <Typography>{wallet.action.data.error}</Typography>
                    </Alert>
                  ) : (
                    ''
                  )}
                  {wallet.action && wallet.action.result === 'success_pending' ? (
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
                          href={wallet.explorer[item.network] + '/tx/' + wallet.action.data.hash}
                          target="_blank"
                        >
                          See transaction on Block Explorer <OpenInNew />
                        </Link>
                      </Box>
                    </Alert>
                  ) : (
                    ''
                  )}
                </Grid>
              </Box>
              <Button variant={'outlined'} onClick={handleClose}>
                Close
              </Button>
            </React.Fragment>
          )
        ) : (
          <Box className={classes.modalForeground} />
        )}
      </Fade>
    </Modal>
  );
};

export const StepsProgress = memo(function StepsProgress({ steps, setSteps }) {
  const action = useSelector(state => state.walletReducer.action);

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

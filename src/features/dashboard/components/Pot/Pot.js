import * as React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import styles from '../../styles';
import { isEmpty } from '../../../../helpers/utils';
import ActiveLayout from './ActiveLayout';
import EOLLayout from './EOLLayout';
import { Card, Cards } from '../../../../components/Cards/Cards';
import { useTranslation } from 'react-i18next';
import { PotImage, PotTitle, PotInfoBlock } from './PotComponents';

const useStyles = makeStyles(styles);

const Pot = function ({ item, wallet, prices, balance }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [steps, setSteps] = React.useState({
    modal: false,
    currentStep: -1,
    items: [],
    finished: false,
  });

  React.useEffect(() => {
    const index = steps.currentStep;
    if (!isEmpty(steps.items[index]) && steps.modal) {
      const items = steps.items;
      if (!items[index].pending) {
        items[index].pending = true;
        items[index].action();
        setSteps({ ...steps, items: items });
      } else {
        if (wallet.action.result === 'success' && !steps.finished) {
          const nextStep = index + 1;
          if (!isEmpty(items[nextStep])) {
            setSteps({ ...steps, currentStep: nextStep });
          } else {
            setSteps({ ...steps, finished: true });
          }
        }
      }
    }
  }, [steps, wallet.action]);

  return (
    <div className={classes.activeMyPot}>
      {/*TODO SIMPLIFY CLASS ^^^*/}
      <Cards>
        <Card variant={item.status == 'active' ? 'purpleLight' : 'purpleDark'}>
          <Grid container spacing={0}>
            {/*Pot Image*/}
            <PotImage item={item} />
            {/*Pot Title*/}
            <PotTitle item={item} prices={prices} />
            {/*Divider Text*/}
            <Grid item xs={12} align={'left'} style={{ paddingBottom: 0 }}>
              <Typography className={classes.dividerText}>{t('myDetails')} </Typography>
            </Grid>
            {/*Info Block*/}
            <PotInfoBlock item={item} prices={prices} />
          </Grid>
          {/*Bottom*/}
          {item.status === 'active' ? (
            <ActiveLayout item={item} wallet={wallet} balance={balance} prices={prices} />
          ) : (
            <EOLLayout item={item} wallet={wallet} balance={balance} prices={prices} />
          )}
        </Card>
      </Cards>
    </div>
  );
};

export default Pot;

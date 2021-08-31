import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Container, makeStyles, Typography } from '@material-ui/core';
import styles from './styles';
import { TVL } from './components/TVL';
import { Translate } from '../../components/Translate';
import SectionSelect from './components/SectionSelect/SectionSelect';
import { useSectionConfig } from './hooks/section';
import Moonpots from './Moonpots/Moonpots';
import MyPots from './MyPots/MyPots';

const useStyles = makeStyles(styles);

const Home = ({ selected }) => {
  const totalPrizesAvailable = useSelector(state => state.vaultReducer.totalPrizesAvailable);
  const classes = useStyles();
  //Config for selected section (moonpots/myPots)
  const [sectionConfig, setSectionConfig] = useSectionConfig();
  const totalPrizesAvailableFormatted = useMemo(() => {
    return totalPrizesAvailable.toNumber().toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [totalPrizesAvailable]);

  React.useEffect(() => {
    if (selected === 'myPots') {
      setSectionConfig({ ...sectionConfig, selected: 'myPots' });
    }
  });

  return (
    <Container maxWidth="none" style={{ padding: '0', overflow: 'hidden' }}>
      <Typography className={classes.mainTitle}>
        <Translate i18nKey="homeTitle" values={{ amount: totalPrizesAvailableFormatted }} />
      </Typography>
      <div className={classes.tvlSpacer}>
        <TVL className={classes.totalTVL} />
      </div>
      <SectionSelect config={sectionConfig} setConfig={setSectionConfig} />
      {sectionConfig.selected === 'moonpots' ? <Moonpots selected={selected} /> : <MyPots />}
    </Container>
  );
};

export default Home;

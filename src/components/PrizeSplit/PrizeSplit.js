import * as React from 'react';
import BigNumber from 'bignumber.js';

const PrizeSplit = ({ item, withBalances = true }) => {
  let awardSponsorBalance = 0;
  let sponsors = item.sponsors;
  if (sponsors.length > 0 && sponsors[0].sponsorToken === item.token) {
    awardSponsorBalance = new BigNumber(sponsors[0].sponsorBalance);
    sponsors = sponsors.slice(1, sponsors.length);
  }
  return (
    <React.Fragment>
      {withBalances
        ? item.awardBalance.plus(awardSponsorBalance).div(item.numberOfWinners).toFixed(2)
        : ''}{' '}
      {item.token}
      {sponsors.map((sponsor, i) => {
        return (
          <React.Fragment key={item.id + i}>
            {i < sponsors.length - 1 ? ', ' : ' & '}
            {withBalances ? sponsor.sponsorBalance.div(item.numberOfWinners).toFixed(2) : ''}{' '}
            {sponsor.sponsorToken}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default PrizeSplit;

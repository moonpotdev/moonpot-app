import { config } from '../config/config';
import BigNumber from 'bignumber.js';

let trimReg = /(^\s*)|(\s*$)/g;

export function isEmpty(key) {
  if (key === undefined || key === '' || key === null) {
    return true;
  }
  if (typeof key === 'string') {
    key = key.replace(trimReg, '');
    return key === '' || key === null || key === 'null' || key === undefined || key === 'undefined';
  } else if (typeof key === 'undefined') {
    return true;
  } else if (typeof key == 'object') {
    for (let i in key) {
      return false;
    }
    return true;
  } else if (typeof key == 'boolean') {
    return false;
  }
}

export const getStablesForNetwork = () => {
  return config.stableCoins;
};

export const toBigNumber = maybeBigNumber => {
  return BigNumber.isBigNumber(maybeBigNumber) ? maybeBigNumber : new BigNumber(maybeBigNumber);
};

export const investmentOdds = (
  ticketTotalSupply,
  numberOfWinners,
  investedTickets = 0,
  newInvestmentTickets = 0
) => {
  const finalTotalSupply = toBigNumber(ticketTotalSupply).plus(newInvestmentTickets);
  const finalTicketsInvested = toBigNumber(investedTickets).plus(newInvestmentTickets);
  const one = toBigNumber(1);

  const oddsOfWinningOnce = finalTicketsInvested.dividedBy(finalTotalSupply);
  const oddsOfLosingOnce = one.minus(oddsOfWinningOnce);
  const oddsOfWinningAtLeastOnce = one.minus(oddsOfLosingOnce.exponentiatedBy(numberOfWinners));

  return one.dividedBy(oddsOfWinningAtLeastOnce).integerValue(BigNumber.ROUND_CEIL).toNumber();
};

export function compound(r, n = 365, t = 1, c = 1) {
  return (1 + (r * c) / n) ** (n * t) - 1;
}

export const styledBy = (property, mapping) => props => mapping[props[property]];

export function indexBy(arr, key, keyTransform = k => k) {
  return Object.fromEntries(arr.map(item => [keyTransform(item[key]), item]));
}

export function groupBy(arr, key, keyTransform = k => k) {
  const out = {};

  arr.forEach(item => {
    const groupKey = keyTransform(item[key]);
    if (groupKey in out) {
      out[groupKey].push(item);
    } else {
      out[groupKey] = [item];
    }
  });

  return out;
}

export function arrayUnique(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}

export function objectArrayFlatten(arr) {
  return arr.reduce((out, next) => ({ ...out, ...next }), {});
}

export const formatAddressShort = addr => {
  return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4, 4);
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function variantClass(classes, prefix, variant, defaultClass = false) {
  const key = prefix + variant[0].toUpperCase() + variant.substr(1);
  return key in classes ? classes[key] : defaultClass;
}

export function sortObjectsAsc(objectsArray, key) {
  return objectsArray.sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]));
}

export function sortObjectsDesc(objectsArray, key) {
  return objectsArray.sort((a, b) => (a[key] < b[key]) - (a[key] > b[key]));
}

//Return the token prize total of a single pot
export const calculateTokenProjectedPrize = ({ pot }) => {
  const projectedPrizeTotal = calculateProjectedPrize(
    pot.apy,
    pot.secondsToDraw,
    pot.totalTokenStaked,
    pot.awardBalance
  );
  return projectedPrizeTotal;
};

//Return the USD prize total of a single pot
export const calculateUSDProjectedPrize = ({ pot }) => {
  const projectedPrizeTotal = calculateProjectedPrize(
    pot.apy,
    pot.secondsToDraw,
    pot.totalStakedUsd,
    pot.awardBalanceUsd
  );
  return projectedPrizeTotal;
};

//Return the USD total of prizes across all pots
export const calculateTotalUsdPrize = ({ pots }) => {
  var prizeTotal = new BigNumber(0);
  var pot;

  for (var i in pots) {
    //For all active pots
    if (pots[i].status === 'active') {
      pot = pots[i];

      //Add base prize to total
      prizeTotal = BigNumber.sum(prizeTotal, calculateUSDProjectedPrize({ pot }));

      //Add sponsor tokens projections
      if (pots[i].id === 'pots') {
        prizeTotal = BigNumber.sum(prizeTotal, calculateZiggyUsdProjection({ pot, pots }));
      } else {
        prizeTotal = BigNumber.sum(prizeTotal, pots[i].totalSponsorBalanceUsd);
      }
    }
  }
  return prizeTotal;
};

//Returns total USD prize projection for ziggys pot
export const calculateZiggyUsdProjection = ({ pot, pots }) => {
  var usdTotal = BigNumber(pot.totalSponsorBalanceUsd);
  for (var i in pots) {
    //Only pots that draw before ziggys
    if (parseInt(pots[i].secondsToDraw) < parseInt(pot.secondsToDraw)) {
      /*Calculate allocated share*/
      var allocatedShare;
      if (pots[i].vaultType === 'main' || pots[i].vaultType === 'stable') {
        allocatedShare = 0.1;
      } else {
        allocatedShare = 0.6;
      }
      if (pots[i].status === 'active') {
        usdTotal = calculateProjectedPrize(
          pots[i].apy, //APY of base asset
          pot.secondsToDraw, //Time till draw of ziggys pot
          pots[i].totalStakedUsd, //Tokens staked in pot of base asset
          usdTotal, //Current balance of token reward in ziggys pot
          allocatedShare //Share of tokens alloted to ziggy prize
        );
      }
    }
  }
  return usdTotal;
};

//Returns token array predictions for each token in ziggys pot
export const calculateZiggyTokenProjections = ({ pot, pots }) => {
  var sponsors = pot.sponsors;
  for (var i in pots) {
    if (pots[i].status === 'active') {
      //Only pots that draw before ziggys
      if (parseInt(pots[i].secondsToDraw) < parseInt(pot.secondsToDraw)) {
        var sponsorIndex = sponsors.findIndex(item => item.sponsorToken === pots[i].token); //Find coresponding sponsor in sponsors array
        /*For non LP pots*/
        if (sponsorIndex != -1) {
          /*Calculate future prize for main pots */
          if (pots[i].vaultType === 'main') {
            /*Token*/
            sponsors[sponsorIndex].sponsorBalance = calculateProjectedPrize(
              pots[i].apy, //APY of base asset
              pot.secondsToDraw, //Time till draw of ziggys pot
              pots[i].totalTokenStaked, //Tokens staked in pot of base asset
              sponsors[sponsorIndex].sponsorBalance, //Current balance of token reward in ziggys pot
              0.1 //Share of tokens alloted to ziggy prize
            );
            /*USD*/
            sponsors[sponsorIndex].sponsorBalanceUsd = calculateProjectedPrize(
              pots[i].apy, //APY of base asset
              pot.secondsToDraw, //Time till draw of ziggys pot
              pots[i].totalStakedUsd, //Tokens staked in pot of base asset
              sponsors[sponsorIndex].sponsorBalanceUsd, //Current balance of token reward in ziggys pot
              0.1 //Share of tokens alloted to ziggy prize
            );
          }
          /*Calculate future prize for community pots */
          if (pots[i].vaultType === 'community') {
            /*Token*/
            sponsors[sponsorIndex].sponsorBalance = calculateProjectedPrize(
              pots[i].apy, //APY of base asset
              pot.secondsToDraw, //Time till draw of ziggys pot
              pots[i].totalTokenStaked, //Tokens staked in pot of base asset
              sponsors[sponsorIndex].sponsorBalance, //Current balance of token reward in ziggys pot
              0.06 //Share of tokens alloted to ziggy prize
            );
            /*USD*/
            sponsors[sponsorIndex].sponsorBalanceUsd = calculateProjectedPrize(
              pots[i].apy, //APY of base asset
              pot.secondsToDraw, //Time till draw of ziggys pot
              pots[i].totalStakedUsd, //Tokens staked in pot of base asset
              sponsors[sponsorIndex].sponsorBalanceUsd, //Current balance of token reward in ziggys pot
              0.06 //Share of tokens alloted to ziggy prize
            );
          }
        } else {
          for (var j in pots[i].contributingToZiggy) {
            sponsorIndex = sponsors.findIndex(
              item => item.sponsorToken === pots[i].contributingToZiggy[j].token
            ); //Find coresponding sponsor in sponsors array (LPs)
            /*Check for only tokens in the sponsors array */
            if (sponsorIndex != -1) {
              /*Get distribution amount to ziggy prize */
              var prizePercent;
              if (pots[i].vaultType === 'lp') {
                prizePercent = 0.06;
              } else {
                prizePercent = 0.1;
              }
              /*Token*/
              sponsors[sponsorIndex].sponsorBalance = calculateProjectedPrize(
                pots[i].apy, //APY of base asset
                pot.secondsToDraw, //Time till draw of ziggys pot
                pots[i].totalTokenStaked, //Tokens staked in pot of base asset
                sponsors[sponsorIndex].sponsorBalance, //Current balance of token reward in ziggys pot
                prizePercent / pots[i].contributingToZiggy.length //Share of tokens alloted to ziggy prize divide by lp components
              );
              /*USD*/
              sponsors[sponsorIndex].sponsorBalanceUsd = calculateProjectedPrize(
                pots[i].apy, //APY of base asset
                pot.secondsToDraw, //Time till draw of ziggys pot
                pots[i].totalStakedUsd, //Tokens staked in pot of base asset
                sponsors[sponsorIndex].sponsorBalanceUsd, //Current balance of token reward in ziggys pot
                prizePercent / pots[i].contributingToZiggy.length //Share of tokens alloted to ziggy prize divide by lp components
              );
            }
          }
        }
      }
    }
  }

  return sponsors;
};

const calculateProjectedPrize = (
  inputAPY,
  inputSecondsToDraw,
  inputTotalStaked,
  inputCurrentBalance,
  multiplier = 0.8
) => {
  const APY = BigNumber(inputAPY); //INPUT APY
  const convertedAPY = BigNumber.sum(APY.multipliedBy(0.01), 1); //Convert APY to decimal and add 1
  var dailyRate = Math.pow(convertedAPY.toFixed(20), 1 / 365) - 1; //Calculate daily APR

  const secondsToDraw = new BigNumber(inputSecondsToDraw); //INPUT seconds till draw
  const daysToDraw = secondsToDraw.dividedBy(86400).toFixed(20); //Convert seconds to days till draw

  const TVL = BigNumber(inputTotalStaked); //INPUT current locked value
  const futureValue = TVL.toFixed(20) * (Math.pow(1 + dailyRate, daysToDraw) - 1) * multiplier; //Calculate value to be added

  const currentAwardBalance = inputCurrentBalance; //INPUT current prize balance
  const projectedPrizeTotal = BigNumber.sum(currentAwardBalance, futureValue);

  return projectedPrizeTotal;
};

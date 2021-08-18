import { useQuery } from '@apollo/client';
import { drawsQuery, totalQuery } from './queries';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { tokensByNetworkAddress } from '../../../config/tokens';
import { client } from './client';
import { arrUnique } from '../../../helpers/utils';
import { byDecimals } from '../../../helpers/format';
import BigNumber from 'bignumber.js';

function getPrizePoolAddresses(network) {
  const pots = require(`../../../config/vault/${network}.json`);
  return arrUnique(pots.map(pot => pot.prizePoolAddress.toLowerCase()));
}

function decorateDraw(draw, network) {
  const pots = require(`../../../config/vault/${network}.json`);

  // add static pot info
  draw.pot = pots.find(p => p.prizePoolAddress.toLowerCase() === draw.prizePool.toLowerCase());

  // numeric for sorting
  draw.block = parseInt(draw.block);

  return draw;
}

export const useDraws = function () {
  const network = 'bsc';
  const { loading, error, data } = useQuery(drawsQuery, {
    client: client,
    variables: {
      pools: getPrizePoolAddresses(network),
    },
  });
  const prizePools = !loading && !error ? data?.prizePools : null;

  const draws = useMemo(() => {
    if (prizePools && prizePools.length) {
      const all = [];
      for (const prizePool of prizePools) {
        if (prizePool.draws && prizePool.draws.length) {
          for (const draw of prizePool.draws) {
            all.push(
              decorateDraw(
                {
                  ...draw,
                  prizePool: prizePool.id,
                },
                network
              )
            );
          }
        }
      }

      // descending sort
      return all.sort((a, b) => (a.block < b.block) - (a.block > b.block));
    }

    return null;
  }, [prizePools]);

  return { loading, error, draws };
};

export const useTotalPrizeValue = function () {
  const network = 'bsc';
  const { loading, error, data } = useQuery(totalQuery, {
    client: client,
    variables: {
      pools: getPrizePoolAddresses(network),
    },
  });

  const prizePools = !loading && !error ? data?.prizePools : null;
  const prices = useSelector(state => state.pricesReducer.prices);

  const total = useMemo(() => {
    let sum = new BigNumber(0);

    if (prizePools && prizePools.length) {
      for (const prizePool of prizePools) {
        for (const { token, amount } of prizePool.totalAwards) {
          const tokenData = tokensByNetworkAddress[network]?.[token.toLowerCase()];
          if (tokenData) {
            const numericAmount = byDecimals(amount, tokenData.decimals);
            const price = new BigNumber(prices[tokenData.oracleId] || 0);
            sum = sum.plus(numericAmount.multipliedBy(price));
          } else {
            console.error(`No token for ${token} on ${network} found`);
          }
        }
      }
    }

    return sum.toNumber();
  }, [prizePools, prices]);

  return { loading, error, total };
};

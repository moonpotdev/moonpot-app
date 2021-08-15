import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import Async from 'react-async';
import { RouteLoading } from '../../components/RouteLoading';
import { Winners } from './components/Winners';

const loadPage = async ({ pageNumber }, { signal }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    results: [
      {
        id: 3,
        name: 'CAKE',
        date: 12345678,
        token: 'CAKE',
        sponsorToken: 'POTS',
        numberOfWinners: 5,
        prizePot: [
          { token: 'CAKE', oracleId: 'Cake', amount: 4640 },
          { token: 'POTS', oracleId: 'POTS', amount: 40000 },
        ],
        winners: [
          { address: '0x0', staked: '1' },
          { address: '0x1', staked: '10' },
          { address: '0x2', staked: '1000' },
          { address: '0x3', staked: '10000' },
          { address: '0x4', staked: '100000' },
        ],
      },
      {
        id: 2,
        name: 'CAKE',
        date: 12345678,
        token: 'CAKE',
        sponsorToken: 'DODO',
        numberOfWinners: 5,
        prizePot: [
          { token: 'CAKE', oracleId: 'Cake', amount: 3780 },
          { token: 'DODO', oracleId: 'DODO', amount: 33750 },
        ],
        winners: [
          { address: '0x0', staked: '1' },
          { address: '0x1', staked: '10' },
          { address: '0x2', staked: '1000' },
          { address: '0x3', staked: '10000' },
          { address: '0x4', staked: '100000' },
        ],
      },
      {
        id: 1,
        name: 'CAKE',
        date: 12345678,
        token: 'CAKE',
        sponsorToken: 'BIFI',
        numberOfWinners: 5,
        prizePot: [
          { token: 'CAKE', oracleId: 'Cake', amount: 1764 },
          { token: 'BIFI', oracleId: 'BIFI', amount: 56.75 },
        ],
        winners: [
          { address: '0x0', staked: '1' },
          { address: '0x1', staked: '10' },
          { address: '0x2', staked: '1000' },
          { address: '0x3', staked: '10000' },
          { address: '0x4', staked: '100000' },
        ],
      },
    ],
    hasMore: true,
    pageNumber: 0,
  };

  // const response = await fetch(`/api/winners/${pageNumber}`, { signal })
  // if (!response.ok) throw new Error(response.statusText)
  // return response.json()
};

const WinnersPage = function () {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <Container maxWidth="xl">
      <Async promiseFn={loadPage} pageNumber={pageNumber}>
        <Async.Pending>
          <RouteLoading />
        </Async.Pending>
        <Async.Fulfilled>
          {data => <Winners {...data} pageNumber={pageNumber} setPageNumber={setPageNumber} />}
        </Async.Fulfilled>
        <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
      </Async>
    </Container>
  );
};

export default WinnersPage;

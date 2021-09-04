import prizeStrategyAbi from '../../../config/abi/prizestrategy.json';
import prizePoolAbi from '../../../config/abi/prizepool.json';
import BigNumber from 'bignumber.js';

const EVENTS_BATCH_SIZE = 1500;

function startWatchDraw(id) {
  return async function (dispatch, getState) {
    const state = getState();
    const watched = state.live[id].watched;

    if (!watched) {
      console.log('starting', id);

      dispatch({
        type: 'live/watch/started',
        payload: {
          id,
        },
      });

      dispatch(progressDrawWatch(id));
    } else {
      console.log('already started', id);
    }
  };
}

async function handleStepIdle(id, dispatch, state) {
  console.log('idle', Date.now());

  const { network, expiresAt } = state.vaultReducer.pools[id];
  const web3 = state.walletReducer.rpc[network];
  const currentBlock = await web3.eth.getBlock('latest');
  const initialBlock = Math.floor((expiresAt - currentBlock.timestamp) / 3 + currentBlock.number);

  console.log(expiresAt, initialBlock);

  dispatch({
    type: 'live/step/pending',
    payload: {
      id,
      initialBlock,
    },
  });

  dispatch(progressDrawWatch(id));
}

async function handleStepPending(id, dispatch, state) {
  console.log('pending', Date.now());

  const { initialBlock } = state.live[id];
  const { network, prizeStrategyAddress } = state.vaultReducer.pools[id];
  const web3 = state.walletReducer.rpc[network];
  const contract = new web3.eth.Contract(prizeStrategyAbi, prizeStrategyAddress);

  const args = {
    fromBlock: initialBlock,
    toBlock: initialBlock + EVENTS_BATCH_SIZE,
  };

  try {
    const events = await contract.getPastEvents('PrizePoolAwardStarted', args);

    if (events.length) {
      dispatch({
        type: 'live/step/started',
        payload: {
          id,
          startBlock: events[0].blockNumber,
          startTx: events[0].transactionHash,
          prizePoolAddress: events[0].returnValues.prizePool,
        },
      });

      dispatch(progressDrawWatch(id));
    } else {
      // wait 3 seconds and check again
      setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
    }
  } catch (e) {
    console.error(e);
    // wait 3 seconds and check again
    setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
  }
}

async function handleStepStarted(id, dispatch, state) {
  console.log('started', Date.now());

  const { startBlock } = state.live[id];
  const { network, prizeStrategyAddress } = state.vaultReducer.pools[id];
  const web3 = state.walletReducer.rpc[network];
  const contract = new web3.eth.Contract(prizeStrategyAbi, prizeStrategyAddress);

  const args = {
    fromBlock: startBlock,
    toBlock: startBlock + EVENTS_BATCH_SIZE,
  };

  try {
    const events = await contract.getPastEvents('PrizePoolAwarded', args);

    if (events.length) {
      dispatch({
        type: 'live/step/awarded',
        payload: {
          id,
          awardBlock: events[0].blockNumber,
          awardTx: events[0].transactionHash,
        },
      });

      dispatch(progressDrawWatch(id));
    } else {
      // wait 3 seconds and check again
      setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
    }
  } catch (e) {
    console.error(e);
    // wait 3 seconds and check again
    setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
  }
}

async function handleStepAwarded(id, dispatch, state) {
  console.log('awarded', Date.now());

  const { awardBlock, prizePoolAddress } = state.live[id];
  const { network } = state.vaultReducer.pools[id];
  const web3 = state.walletReducer.rpc[network];
  const contract = new web3.eth.Contract(prizePoolAbi, prizePoolAddress);
  const eventAwarded = contract._generateEventOptions('Awarded');
  const eventAwardedExternalERC20 = contract._generateEventOptions('AwardedExternalERC20');
  // const eventAwardedExternalERC721 = contract._generateEventOptions('AwardedExternalERC721');

  const args = {
    fromBlock: awardBlock,
    toBlock: awardBlock,
    topics: [
      [
        eventAwarded.params.topics[0],
        eventAwardedExternalERC20.params.topics[0],
        // eventAwardedExternalERC721.params.topics[0],
      ],
    ],
  };

  try {
    const events = await contract.getPastEvents('allevents', args);

    if (events.length) {
      const winners = {};

      for (const event of events) {
        const { winner, token, amount } = event.returnValues;

        if (!(winner in winners)) {
          winners[winner] = {};
        }

        if (!(token in winners[winner])) {
          winners[winner][token] = new BigNumber(0);
        }

        winners[winner][token] = winners[winner][token].plus(amount);
      }

      dispatch({
        type: 'live/step/finished',
        payload: {
          id,
          winners,
        },
      });
    } else {
      // wait 3 seconds and check again
      setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
    }
  } catch (e) {
    console.error(e);
    // wait 3 seconds and check again
    setTimeout(() => dispatch(progressDrawWatch(id)), 3000);
  }
}

function progressDrawWatch(id) {
  return async function (dispatch, getState) {
    const state = getState();
    const { watched, step } = state.live[id];

    if (watched) {
      switch (step) {
        case 'idle':
          return handleStepIdle(id, dispatch, state);
        case 'pending':
          return handleStepPending(id, dispatch, state);
        case 'started':
          return handleStepStarted(id, dispatch, state);
        case 'awarded':
          return handleStepAwarded(id, dispatch, state);
        default:
          return null;
      }
    }
  };
}

function stopWatchDraw(id) {
  return async function (dispatch, getState) {
    const state = getState();
    const draw = state.live[id];

    if (draw.watched) {
      console.log('stopping', id);

      dispatch({
        type: 'live/watch/stopped',
        payload: {
          id,
        },
      });
    } else {
      console.log('already stopped', id);
    }
  };
}

const liveActions = {
  startWatchDraw,
  stopWatchDraw,
};

export default liveActions;

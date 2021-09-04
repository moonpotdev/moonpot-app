import { potsByNetwork } from '../../../config/vault';
import { config } from '../../../config/config';

const initialState = (function () {
  const initial = {};

  for (const network of Object.keys(config)) {
    for (const pot of potsByNetwork[network]) {
      initial[pot.id] = {
        watched: false,
        step: 'idle',
        initialBlock: 0,
        startBlock: 0,
        startTx: null,
        prizePoolAddress: null,
        awardBlock: 0,
        awardTx: null,
        winners: null,
      };
    }
  }

  return initial;
})();

const liveReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'live/watch/started': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          watched: true,
        },
      };
    }
    case 'live/step/pending': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          step: 'pending',
          initialBlock: action.payload.initialBlock,
        },
      };
    }
    case 'live/step/started': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          step: 'started',
          startBlock: action.payload.startBlock,
          startTx: action.payload.startTx,
          prizePoolAddress: action.payload.prizePoolAddress,
        },
      };
    }
    case 'live/step/awarded': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          step: 'awarded',
          awardBlock: action.payload.awardBlock,
          awardTx: action.payload.awardTx,
        },
      };
    }
    case 'live/step/finished': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          step: 'finished',
          winners: action.payload.winners,
        },
      };
    }
    case 'live/watch/stopped': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          watched: false,
          interval: null,
        },
      };
    }
    default:
      return state;
  }
};

export default liveReducer;

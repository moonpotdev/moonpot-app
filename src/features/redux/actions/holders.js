import { FETCH_HOLDERS_BEGIN, FETCH_HOLDERS_SUCCESS, FETCH_HOLDERS_FAILURE } from '../constants';

const fetchHolders = () => {
  return dispatch => {
    console.log('redux fetchHolders called.');
    dispatch(fetchHoldersBegin());
    return fetch('https://api.moonpot.com/holders/cadets')
      .then(res => res.json())
      .then(json => {
        if ('data' in json && 'cadets' in json.data) {
          dispatch(fetchHoldersSuccess(json.data));
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(error => dispatch(fetchHoldersFailure(error)));
  };
};

const fetchHoldersBegin = () => ({
  type: FETCH_HOLDERS_BEGIN,
});

const fetchHoldersSuccess = payload => ({
  type: FETCH_HOLDERS_SUCCESS,
  payload: payload,
});

const fetchHoldersFailure = error => ({
  type: FETCH_HOLDERS_FAILURE,
  payload: { error },
});

const obj = {
  fetchHolders,
  fetchHoldersBegin,
  fetchHoldersSuccess,
  fetchHoldersFailure,
};

export default obj;

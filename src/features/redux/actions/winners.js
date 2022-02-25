import { FETCH_WINNERS_BEGIN, FETCH_WINNERS_SUCCESS, FETCH_WINNERS_FAILURE } from '../constants';

const fetchWinners = () => {
  return dispatch => {
    console.log('redux fetchWinners called.');
    dispatch(fetchWinnersBegin());
    return fetch('https://api.moonpot.com/winners/unique')
      .then(res => res.json())
      .then(json => {
        if ('data' in json && 'uniqueWinners' in json.data) {
          dispatch(fetchWinnersSuccess(json.data));
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(error => dispatch(fetchWinnersFailure(error)));
  };
};

const fetchWinnersBegin = () => ({
  type: FETCH_WINNERS_BEGIN,
});

const fetchWinnersSuccess = payload => ({
  type: FETCH_WINNERS_SUCCESS,
  payload: payload,
});

const fetchWinnersFailure = error => ({
  type: FETCH_WINNERS_FAILURE,
  payload: { error },
});

const obj = {
  fetchWinners,
  fetchWinnersBegin,
  fetchWinnersSuccess,
  fetchWinnersFailure,
};

export default obj;

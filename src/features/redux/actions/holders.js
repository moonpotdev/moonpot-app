import { FETCH_HOLDERS_BEGIN, FETCH_HOLDERS_SUCCESS, FETCH_HOLDERS_FAILURE } from '../constants';

const fetchHolders = () => {
  return dispatch => {
    console.log('redux fetchHolders called.');
    dispatch(fetchHoldersBegin());
    return fetch('https://api.moonpot.com/holders/pots')
      .then(res => res.json())
      .then(json => {
        const rawHolders = json['data'];
        const totalHolders = rawHolders['all']['uniqueHolders'];
        dispatch(fetchHoldersSuccess(rawHolders, totalHolders));
        return json;
      })
      .catch(error => dispatch(fetchHoldersFailure(error)));
  };
};

const fetchHoldersBegin = () => ({
  type: FETCH_HOLDERS_BEGIN,
});

const fetchHoldersSuccess = (holders, totalHolders) => ({
  type: FETCH_HOLDERS_SUCCESS,
  payload: { holders, totalHolders },
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

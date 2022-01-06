import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const fetchBuybacks = () => {
  return dispatch => {
    console.log('redux fetchBuybacks called.');
    //Setup variables for managing caching data up to 24hrs to avoid unnecessary API calls.
    const now = new Date();
    const ttl = 86400000;
    const lastWeekBuybackKey = 'lastWeekBuyback';
    dispatch(fetchBuybacksBegin());
    //Get cached data from localStorage
    const cachedData = JSON.parse(window.localStorage.getItem(lastWeekBuybackKey));
    //If the data exists and is not expired, return it.
    if (cachedData && now.getTime() < cachedData.expiry) {
      console.log('redux fetchBuybacks returning cached data.');
      dispatch(fetchBuybacksSuccess(cachedData.value));
      return;
    } else {
      console.log('redux fetchBuybacks calling API.');
      //If the data is expired, continue with an API call and replace the cached data.
      return fetch('https://potsprice.herokuapp.com/buyback', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers':
            'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
      })
        .then(res => res.json())
        .then(json => {
          const lastWeekBuyback = json['lastWeekBuyback'];
          const lastWeekBuybackCache = {
            value: lastWeekBuyback,
            expiry: now.getTime() + ttl,
          };
          window.localStorage.setItem(lastWeekBuybackKey, JSON.stringify(lastWeekBuybackCache));
          dispatch(fetchBuybacksSuccess(lastWeekBuyback));
          return json;
        })
        .catch(error => dispatch(fetchBuybacksFailure(error)));
    }
  };
};

const fetchBuybacksBegin = () => ({
  type: FETCH_BUYBACKS_BEGIN,
});

const fetchBuybacksSuccess = lastWeekBuyback => ({
  type: FETCH_BUYBACKS_SUCCESS,
  payload: { lastWeekBuyback },
});

const fetchBuybacksFailure = error => ({
  type: FETCH_BUYBACKS_FAILURE,
  payload: { error },
});

const obj = {
  fetchBuybacks,
  fetchBuybacksBegin,
  fetchBuybacksSuccess,
  fetchBuybacksFailure,
};

export default obj;

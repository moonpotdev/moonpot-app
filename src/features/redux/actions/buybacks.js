import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const fetchBuybacks = () => {
  return dispatch => {
    console.log('redux fetchBuybacks called.');
    dispatch(fetchBuybacksBegin());
    return fetch('https://api.moonpot.com/buybacks/summary')
      .then(res => res.json())
      .then(json => {
        const rawData = json['data'];
        const lastWeekBuyback = rawData['lastWeekBuyback'];
        const lastMonthBuyback = rawData['lastMonthBuyback'];
        const allTimeBuyback = rawData['allTimeBuyback'];
        dispatch(fetchBuybacksSuccess(lastWeekBuyback, lastMonthBuyback, allTimeBuyback));
        return json;
      })
      .catch(error => dispatch(fetchBuybacksFailure(error)));
  };
};

const fetchBuybacksBegin = () => ({
  type: FETCH_BUYBACKS_BEGIN,
});

const fetchBuybacksSuccess = (lastWeekBuyback, lastMonthBuyback, allTimeBuyback) => ({
  type: FETCH_BUYBACKS_SUCCESS,
  payload: { lastWeekBuyback, lastMonthBuyback, allTimeBuyback },
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

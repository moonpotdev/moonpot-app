import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const fetchBuybacks = () => {
  return dispatch => {
    console.log('redux fetchBuybacks called.');
    dispatch(fetchBuybacksBegin());
    return fetch('https://api.moonpot.com/buybacks')
      .then(res => res.json())
      .then(json => {
        const rawBuybacks = json['data'];
        var buybackTotal = 0;
        var lastBuybackTotal = 0;
        for (const pot in rawBuybacks) {
          buybackTotal += rawBuybacks[pot]['allTimeBuyback'];
          lastBuybackTotal += rawBuybacks[pot]['lastBuyback'];
        }
        dispatch(fetchBuybacksSuccess(rawBuybacks, buybackTotal, lastBuybackTotal));
        return json;
      })
      .catch(error => dispatch(fetchBuybacksFailure(error)));
  };
};

const fetchBuybacksBegin = () => ({
  type: FETCH_BUYBACKS_BEGIN,
});

const fetchBuybacksSuccess = (buybacks, buybacksTotal, lastBuybacksTotal) => ({
  type: FETCH_BUYBACKS_SUCCESS,
  payload: { buybacks, buybacksTotal, lastBuybacksTotal },
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

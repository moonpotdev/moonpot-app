import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const fetchBuybacks = () => {
  return dispatch => {
    console.log('redux fetchBuybacks called.');
    dispatch(fetchBuybacksBegin());
    return fetch('https://api.moonpot.com/buybacks')
      .then(res => res.json())
      .then(json => {
        dispatch(fetchBuybacksSuccess(json['data']));
        return json;
      })
      .catch(error => dispatch(fetchBuybacksFailure(error)));
  };
};

const fetchBuybacksBegin = () => ({
  type: FETCH_BUYBACKS_BEGIN,
});

const fetchBuybacksSuccess = buybacks => ({
  type: FETCH_BUYBACKS_SUCCESS,
  payload: { buybacks },
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

import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const fetchBuybacks = () => {
  return dispatch => {
    console.log('redux fetchBuybacks called.');
    dispatch(fetchBuybacksBegin());
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
        dispatch(fetchBuybacksSuccess(lastWeekBuyback));
        return json;
      })
      .catch(error => dispatch(fetchBuybacksFailure(error)));
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

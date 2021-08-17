import axios from 'axios';

const fetchPrices = reducer => {
  const cache = new Date();
  cache.setSeconds(0, 0);

  return async (dispatch, getState) => {
    const updatePrices = async () => {
      console.log('redux fetchPrices called.');
      const retry = () => {
        setTimeout(async () => {
          return await updatePrices();
        }, 1000);
      };

      try {
        const request = await axios.get('https://api.beefy.finance/prices?_=' + cache.getTime(), {
          timeout: 1000,
        });
        return request.status === 200 ? request.data : retry();
      } catch (err) {
        console.log('error fetchPrices()', err);
        return retry();
      }
    };

    const updateApy = async () => {
      console.log('redux fetchApy called.');
      const retry = () => {
        setTimeout(async () => {
          return await updateApy();
        }, 1000);
      };
      try {
        const request = await axios.get(
          'https://api.beefy.finance/apy/breakdown?_=' + cache.getTime(),
          { timeout: 1000 }
        );
        return request.status === 200 ? request.data : retry();
      } catch (err) {
        console.log('error fetchApy()', err);
        return retry();
      }
    };

    const fetch = async () => {
      const state = getState();
      const prices = await updatePrices(state.pricesReducer);
      const apy = await updateApy(state.pricesReducer);

      dispatch({
        type: 'FETCH_PRICES',
        payload: {
          prices: { ...prices, ...state.pricesReducer.prices },
          apy: apy,
          lastUpdated: new Date().getTime(),
        },
      });
    };

    await fetch();

    setInterval(async () => {
      await fetch();
    }, 300000);
  };
};

const obj = {
  fetchPrices,
};

export default obj;

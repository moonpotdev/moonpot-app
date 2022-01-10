import { UPDATE_FILTER_SORT } from '../constants';

const updateFilterSort = sort => ({
  type: UPDATE_FILTER_SORT,
  payload: {
    sort: sort,
  },
});

const obj = {
  updateFilterSort,
};

export default obj;

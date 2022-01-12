import { UPDATE_FILTER_SORT, UPDATE_FILTER_STATUS } from '../constants';

const updateFilterSort = sort => ({
  type: UPDATE_FILTER_SORT,
  payload: {
    sort: sort,
  },
});

const updateFilterStatus = status => ({
  type: UPDATE_FILTER_STATUS,
  payload: {
    status: status,
  },
});

const obj = {
  updateFilterSort,
  updateFilterStatus,
};

export default obj;

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUniqueWinners = createAsyncThunk('winners/fetchUnique', async () => {
  const request = await axios.get('https://api.moonpot.com/winners/unique', {
    timeout: 2000,
  });

  if (request.status !== 200) {
    throw new Error(`fetchUniqueWinners: invalid status ${request.status}`);
  }

  if (!request.data || !request.data.data || !('uniqueWinners' in request.data.data)) {
    throw new Error(`fetchUniqueWinners: malformed response`);
  }

  return request.data.data;
});

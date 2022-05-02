import { createAsyncThunk } from '@reduxjs/toolkit';
import { ShrimpEntity } from '../entities/shrimps';
import { getShrimpsApi } from '../apis/shrimps';

export const fetchShrimps = createAsyncThunk<ShrimpEntity[]>('shrimps/fetchShrimps', async () => {
  const api = getShrimpsApi();
  const shrimps = await api.fetchShrimps();
  return shrimps.map((shrimp, i) => ({ ...shrimp, id: `${shrimp.address}-${i}` }));
});

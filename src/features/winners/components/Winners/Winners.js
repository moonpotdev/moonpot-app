import React from 'react';
import { Cards } from '../../../../components/Cards/Cards';
import { Total } from '../Total';
import { Draw } from '../Draw';
import { useSelector } from 'react-redux';

export const Winners = function ({ results }) {
  const sortedIds = useSelector(state => state.prizeDraws.sortedIds);

  return (
    <Cards>
      <Total />
      {sortedIds.map(id => (
        <Draw key={id} id={id} />
      ))}
    </Cards>
  );
};

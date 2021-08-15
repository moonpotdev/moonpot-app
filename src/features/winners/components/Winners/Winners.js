import React from 'react';
import { Cards } from '../../../../components/Cards/Cards';
import { Total } from '../Total';
import { Draw } from '../Draw';

export const Winners = function ({ results }) {
  return (
    <Cards>
      <Total results={results} />
      {results.map(result => (
        <Draw id={result.id} result={result} />
      ))}
    </Cards>
  );
};

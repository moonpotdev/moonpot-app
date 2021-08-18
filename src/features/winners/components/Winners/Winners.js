import React from 'react';
import { Cards } from '../../../../components/Cards';
import { Total } from '../Total';
import { Draws } from '../Draws';

export const Winners = function () {
  return (
    <Cards>
      <Total />
      <Draws />
    </Cards>
  );
};

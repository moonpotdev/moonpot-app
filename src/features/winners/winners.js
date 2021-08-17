import React from 'react';
import { Container } from '@material-ui/core';
import { Winners } from './components/Winners';

const WinnersPage = function () {
  return (
    <Container maxWidth="xl">
      <Winners />
    </Container>
  );
};

export default WinnersPage;

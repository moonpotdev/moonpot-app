import * as React from 'react';
import { Container } from '@material-ui/core';
import { promosAll } from '../../config/promo';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';

const Promos = () => {
  return (
    <React.Fragment>
      <Container maxWidth="xs">
        {promosAll
          .filter(p => !p.disabled)
          .map(promo => (
            <SecondaryButton
              to={`/promo/${promo.name}`}
              variant="purple"
              fullWidth={true}
              style={{ marginTop: '16px' }}
            >
              {promo.desc}
            </SecondaryButton>
          ))}
      </Container>
    </React.Fragment>
  );
};
export default Promos;

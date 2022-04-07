import React, { memo, PropsWithChildren, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { Container } from '../Container';
import ziggyInPotUrl from '../../images/ziggy/inPot.svg';
import styles from './styles';

const useStyles = makeStyles(styles);

export type NoPotsCardProps = PropsWithChildren<{
  title?: string;
  text?: string[];
  buttons?: ReactNode | undefined;
}>;
export const NoPotsCard = memo<NoPotsCardProps>(function NoPotsCard({ title, text, buttons }) {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.card}>
        <img src={ziggyInPotUrl} alt="" width={100} height={100} className={classes.ziggy} />
        {title ? <h3 className={classes.title}>{title}</h3> : null}
        {text ? (
          <div className={classes.text}>
            {text.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        ) : null}
        {buttons ? <div className={classes.buttons}>{buttons}</div> : null}
      </div>
    </Container>
  );
});

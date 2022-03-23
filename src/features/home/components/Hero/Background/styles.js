import starsUrl from '../../../../../images/hero/stars.svg';
import cloudsUrl from '../../../../../images/hero/clouds.png';
import rocketUrl from '../../../../../images/hero/rocket.svg';
import planetGreenUrl from '../../../../../images/hero/planetGreen.svg';
import planetYellowUrl from '../../../../../images/hero/planetYellow.svg';

const styles = theme => ({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    width: '1220px',
    maxWidth: '100%',
    margin: '0 auto',
  },
  stars: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url('${starsUrl}')`,
      backgroundRepeat: 'repeat',
      animationName: '$stars',
      animationDuration: '6s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  },
  clouds: {
    position: 'absolute',
    bottom: '-0.5px', // rounding errors
    left: 0,
    width: '100%',
    height: '0',
    paddingBottom: `${(200 / 1440) * 100}%`,
    overflow: 'hidden',
    pointerEvents: 'none',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '200px',
      maxHeight: '100%',
      backgroundImage: `url('${cloudsUrl}')`,
      backgroundRepeat: 'repeat-x',
      backgroundPositionY: '100%',
      backgroundPositionX: '50%',
      backgroundSize: 'contain',
    },
  },
  rocket: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: `${(530 / 1220) * 100}%`,
    maxWidth: '530px',
    '&::after': {
      content: '""',
      display: 'block',
      height: 0,
      paddingBottom: `${(672 / 530) * 100}%`,
      backgroundImage: `url('${rocketUrl}')`,
      backgroundRepeat: 'no-repeat',
    },
  },
  planetGreen: {
    position: 'absolute',
    top: '25%',
    right: '16px',
    width: `${(216 / 1220) * 100}%`,
    maxWidth: '216px',
    '&::after': {
      content: '""',
      display: 'block',
      height: 0,
      paddingBottom: `100%`,
      backgroundImage: `url('${planetGreenUrl}')`,
      backgroundRepeat: 'no-repeat',
    },
  },
  planetYellow: {
    position: 'absolute',
    bottom: '10%',
    left: '16px',
    // width: `${(143 / 1220) * 100}%`,
    width: '143px',
    '&::after': {
      content: '""',
      display: 'block',
      height: 0,
      paddingBottom: `${(94 / 143) * 100}%`,
      backgroundImage: `url('${planetYellowUrl}')`,
      backgroundRepeat: 'no-repeat',
    },
  },
  '@keyframes stars': {
    '0%': {
      transform: 'rotate(0deg) translateX(10px) rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg) translateX(10px) rotate(-360deg)',
    },
  },
});

export default styles;

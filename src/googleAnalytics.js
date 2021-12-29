import { memo, useEffect } from 'react';
import { useLocation } from 'react-router';
import ReactGA from 'react-ga';

const isDevEnv = process.env.NODE_ENV === 'development';
const enableInDev = process.env.REACT_APP_GA_DEV_ENABLED === 'true';
const active = process.env.REACT_APP_GA_TRACKING_ID && (!isDevEnv || enableInDev);
let initialized = false;

function initialize() {
  if (!initialized) {
    initialized = true;

    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
      debug: isDevEnv,
      gaOptions: {
        siteSpeedSampleRate: 0,
        cookieDomain: 'auto',
        allowLinker: true,
      },
    });

    ReactGA.ga('require', 'linker');
    ReactGA.ga('linker:autoLink', [
      'moonpot.com',
      'www.moonpot.com',
      'ziggyverse.com',
      'www.ziggyverse.com',
    ]);
  }
}

const GoogleAnalyticsImpl = memo(function () {
  const { pathname } = useLocation();

  useEffect(() => {
    initialize();
    ReactGA.pageview(pathname);
  }, [pathname]);

  return null;
});

const GoogleAnalyticsShim = memo(function () {
  return null;
});

export const GoogleAnalytics = active ? GoogleAnalyticsImpl : GoogleAnalyticsShim;
export const GoogleAnalyticsActive = active;

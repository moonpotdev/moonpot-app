import React, { memo, PropsWithChildren } from 'react';
import { Trans, useTranslation } from 'react-i18next';

// TODO types
export const Translate = memo(function (props: PropsWithChildren<any>) {
  const { t } = useTranslation();
  return <Trans t={t} {...props} />;
});

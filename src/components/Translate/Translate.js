import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const Translate = memo(function (props) {
  const { t } = useTranslation();
  return <Trans t={t} {...props} />;
});

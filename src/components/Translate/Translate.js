import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const Translate = memo(function ({ i18nKey, values }) {
  const { t } = useTranslation();
  return <Trans t={t} i18nKey={i18nKey} values={values} />;
});

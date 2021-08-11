import React from 'react';
import { Trans } from 'react-i18next';

export function TransListJoin({ list }) {
  if (list.length === 0) {
    return '';
  } else if (list.length === 1) {
    return <Trans i18nKey="list.one" values={{ item: list[0] }} />;
  } else if (list.length === 2) {
    return <Trans i18nKey="list.two" values={{ first: list[0], last: list[1] }} />;
  } else {
    return list.map((item, index) => {
      const key = `${item}${index}`;
      if (index === 0) {
        return <Trans key={key} i18nKey="list.start" values={{ item }} />;
      } else if (index === list.length - 1) {
        return <Trans key={key} i18nKey="list.end" values={{ item }} />;
      }
      return <Trans key={key} i18nKey="list.join" values={{ item }} />;
    });
  }
}

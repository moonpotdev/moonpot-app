import React from 'react';
import { Translate } from '../Translate';

export function TransListJoin({ list }) {
  if (list.length === 0) {
    return '';
  } else if (list.length === 1) {
    return <Translate i18nKey="list.one" values={{ item: list[0] }} />;
  } else if (list.length === 2) {
    return <Translate i18nKey="list.two" values={{ first: list[0], last: list[1] }} />;
  } else {
    return list.map((item, index) => {
      const key = `${item}${index}`;
      if (index === 0) {
        return <Translate key={key} i18nKey="list.start" values={{ item }} />;
      } else if (index === list.length - 1) {
        return <Translate key={key} i18nKey="list.end" values={{ item }} />;
      }
      return <Translate key={key} i18nKey="list.join" values={{ item }} />;
    });
  }
}

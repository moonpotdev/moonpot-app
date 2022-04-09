import React, { memo, PropsWithChildren, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import styles from './styles';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export type ToggleButtonProps = PropsWithChildren<{
  value: string;
  label: string;
  selected: boolean;
  onChange: (value: string) => void;
}>;

export const ToggleButton = memo(function ToggleButton({
  value,
  label,
  selected,
  onChange,
}: ToggleButtonProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = useCallback(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <button
      className={clsx(classes.button, { [classes.selected]: selected })}
      onClick={handleChange}
    >
      {t(label)}
    </button>
  );
});

export type ToggleButtonGroupProps = PropsWithChildren<{
  selected: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
  className?: string;
}>;

export const ToggleButtonGroup = memo(function ToggleButtonGroup({
  selected,
  options,
  onChange,
  className,
}: ToggleButtonGroupProps) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.group, className)}>
      {options.map(({ value, label }) => (
        <ToggleButton
          key={value}
          value={value}
          label={label}
          onChange={onChange}
          selected={selected === value}
        />
      ))}
    </div>
  );
});

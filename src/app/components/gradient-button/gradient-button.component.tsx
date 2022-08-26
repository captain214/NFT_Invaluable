import React, { FC, MouseEventHandler } from 'react';
import cn from 'classnames';

import './gradient-button.styles.scss';
import { WithClassname } from '../../types/common/WithClassname';

interface IProps {
  variant?: 'filled' | 'contained' | 'simple';
  size?: 'small' | 'normal';
  filledColor?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler;
}

export const GradientButton: FC<IProps & WithClassname> = (props) => {
  const {
    children,
    className,
    disabled = false,
    loading = false,
    variant = 'contained',
    size = 'normal',
    filledColor = '#000000'
  } = props;

  const handleClick: MouseEventHandler = (e) => {
    if (disabled || loading) return;
    props.onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'gradient-button-root',
        `gradient-button-root--${variant}`,
        `gradient-button-root--${size}`,
        disabled && 'gradient-button-root--disabled',
        loading && 'gradient-button-root--loading',
        className
      )}
      style={{
        background:
          (variant === 'contained' || undefined) &&
          `linear-gradient(${filledColor}, ${filledColor}) padding-box, linear-gradient(90deg, #7BF1F5 0%, #C439DD 50%, #4925E9 100%) border-box`,
        backgroundColor: filledColor
      }}
    >
      {children}
    </button>
  );
};

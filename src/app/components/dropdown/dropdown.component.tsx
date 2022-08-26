import React, { ReactElement, useState } from 'react';
import cn from 'classnames';
import './dropdown.styles.scss';

import { WithClassname } from '../../types/common/WithClassname';
import downArrow from '../../../assets/images/down_arrow.svg';

interface IProps<T> {
  suggestions: ISuggestion<T>[];
  filledColor?: string;
  onChange?: (value: ISuggestion<T>) => void;
  placeholder?: string;
  defaultValue?: ISuggestion<T>;
  size?: 'small' | 'normal';
  variant?: 'contained' | 'filled';
}

export interface ISuggestion<T = string> {
  id: T;
  value: string;
  startIcon?: string;
}

export const Dropdown = <T,>(props: IProps<T> & WithClassname): ReactElement => {
  const { filledColor = '#000000', size = 'normal', variant = 'contained' } = props;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(props.defaultValue);

  const selectSuggestion = (value: ISuggestion<T>) => {
    setDropdownValue(value);
    setShowSuggestions(false);
    if (props.onChange) props.onChange(value);
  };

  return (
    <div
      className={cn(props.className, 'dropdown-wrapper', `dropdown-wrapper--${variant}`)}
      style={{
        background:
          (variant === 'contained' || undefined) &&
          `linear-gradient(${filledColor}, ${filledColor}) padding-box, linear-gradient(90deg, #7BF1F5 0%, #C439DD 50%, #4925E9 100%) border-box`,
        backgroundColor: filledColor
      }}
    >
      <div className={cn('dropdown-root', `dropdown-root--${size}`)}>
        {dropdownValue?.startIcon && (
          <img src={dropdownValue.startIcon} alt="" className="suggestions-item-icon" />
        )}
        <button
          type="button"
          onClick={() => {
            setShowSuggestions((prev) => !prev);
          }}
          className="dropdown-btn"
        >
          <span className={cn('dropdown-value', !dropdownValue?.value && 'dropdown-value--empty')}>
            {dropdownValue?.value || props.placeholder}
          </span>
          <img
            className={cn('dropdown-arrow', showSuggestions && 'dropdown-arrow--up')}
            src={downArrow}
            alt=""
          />
        </button>
        {showSuggestions && (
          <div className="suggestions">
            {props.suggestions.map((item) => (
              <button
                key={item.value}
                className="suggestions-item"
                onClick={() => selectSuggestion(item)}
                type="button"
              >
                {item.startIcon && (
                  <img src={item.startIcon} alt="" className="suggestions-item-icon" />
                )}
                {item.value}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import cn from 'classnames';

import './filter-button.styles.css';

interface IProps {
  image: string;
  text: string;
  isActive?: boolean;
  onClick?: <T = unknown, R = unknown>(args?: T) => R | void;
  theme?: 'dark' | 'light';
}

export const FilterButton: React.FunctionComponent<IProps> = (props: IProps) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn('filter-button-wrapper', `filter-button-wrapper__${props.theme}`, {
        [`is-active__${props.theme}`]: props.isActive
      })}
    >
      <img src={props.image} alt="" />
      <div className={cn('filter-button-text', `filter-button-text__${props.theme}`)}>
        {props.text}
      </div>
    </button>
  );
};

FilterButton.defaultProps = {
  isActive: false,
  onClick: () => {},
  theme: 'dark'
};

import React from 'react';
import useClassNames from 'classnames';

import './burger-button.styles.css';
import './burger-button.styles.layout.css';

interface Props {
  className?: string;
  isActive?: boolean;
  onClick?: <T = unknown, R = unknown>(args?: T) => R | void;
}

export const BurgerButton: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <button
      type="button"
      className={useClassNames(`${props.className} burger-button hamburger hamburger--squeeze`, {
        'is-active': props.isActive
      })}
      onClick={props.onClick}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner" />
      </span>
    </button>
  );
};

BurgerButton.defaultProps = {
  className: '',
  isActive: false,
  onClick: () => {}
};

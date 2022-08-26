import React, { FC, ReactNode, useState } from 'react';
import cn from 'classnames';
import { WithClassname } from '../../types/common/WithClassname';
import { ReactComponent as DownArrow } from '../../../assets/images/down_arrow.svg';

import './collapsible.style.css';

interface IProps {
  defaultIsOpen?: boolean;
  title?: string;
  theme?: 'dark' | 'light';
  icon?: ReactNode;
}

export const Collapsible: FC<IProps & WithClassname> = (props) => {
  const { title = '', theme = 'light' } = props;
  const [isOpen, setIsOpen] = useState(props.defaultIsOpen);
  const handleToggle = () => setIsOpen(!isOpen);
  return (
    <div className={cn(props.className, 'collapsible', `collapsible-theme-${theme}`)}>
      <button type="button" className="collapsible__header" onClick={handleToggle}>
        {props.icon}
        <div className="collapsible__header-title">{title.toUpperCase()}</div>
        <DownArrow
          className={cn('collapsible__header-icon', isOpen && 'collapsible__header-icon--opened')}
        />
      </button>
      {isOpen && <div className="collapsible__content">{props.children}</div>}
    </div>
  );
};

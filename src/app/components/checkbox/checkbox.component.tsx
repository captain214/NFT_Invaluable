import cn from 'classnames';
import { FC, useState } from 'react';
import { WithClassname } from '../../types/common/WithClassname';

import './checkbox.styles.scss';

interface IProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => unknown;
  tabIndex?: number;
}

export const Checkbox: FC<WithClassname & IProps> = (props) => {
  const { className, defaultChecked, checked, tabIndex, onChange } = props;
  const [isChecked, setIsChecked] = useState<boolean>(
    checked !== undefined ? checked : defaultChecked || false
  );

  const handleClick = () => {
    if (checked !== undefined) return;
    setIsChecked(!isChecked);
    onChange?.(!isChecked);
  };

  const checkedValue = checked !== undefined ? checked : isChecked;
  return (
    <button
      className={cn(
        'streak-checkbox-root',
        checkedValue && 'streak-checkbox-root--checked',
        className
      )}
      type="button"
      onClick={handleClick}
      tabIndex={tabIndex}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="inherit"
        viewBox="0 0 22 22"
        className="streak-checkbox-root__svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#4925E9" />
            <stop offset="50%" stopColor="#C439DD" />
            <stop offset="100%" stopColor="#7BF1F5" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#C439DD" />
            <stop offset="100%" stopColor="#4925E9" />
          </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="10" stroke="url(#gradient)" strokeWidth="1" fill="inherit" />
        <g transform="translate(4, 6)">
          <path
            className="streak-checkbox-root__checkbox"
            fillRule="evenodd"
            clipRule="evenodd"
            fill={checkedValue ? 'url(#gradient2)' : 'none'}
            d="M0.346118 6.30503C-0.712468 5.24098 0.897351 3.62247 1.95633 4.68651L5.5223 8.27128L11.7668 1.31363C12.7655 0.197998 14.456 1.72633 13.457 2.84275L6.44728 10.6526C6.02221 11.1779 5.23669 11.2208 4.75872 10.74L0.346118 6.30503Z"
          />
        </g>
      </svg>
      <input type="checkbox" checked={checkedValue} readOnly={checked !== undefined} hidden />
    </button>
  );
};

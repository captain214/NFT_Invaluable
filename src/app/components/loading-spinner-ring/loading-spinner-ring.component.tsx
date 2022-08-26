import { FC } from 'react';
import './loading-spinner-ring.styles.scss';
import cn from 'classnames';
import { WithClassname } from '../../types/common/WithClassname';

export const LoadingSpinnerRing: FC<WithClassname> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('loading-spinner-ring-root', props.className)}
      width="62"
      height="62"
      viewBox="0 0 60 60"
    >
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor="#4925E9" />
          <stop offset="50%" stopColor="#C439DD" />
          <stop offset="100%" stopColor="#7BF1F5" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="26" stroke="url(#gradient)" strokeWidth="6" fill="none" />
    </svg>
  );
};

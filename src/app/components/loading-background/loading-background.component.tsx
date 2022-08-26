import React, { FC } from 'react';
import { LoadingSpinnerRing } from '../loading-spinner-ring/loading-spinner-ring.component';

import './loading-background.styles.scss';

interface IProps {
  title?: string;
}

export const LoadingBackground: FC<IProps> = (props) => {
  const { title = 'Loading...' } = props;

  return (
    <div className="loading-background">
      <LoadingSpinnerRing className="loading-background__spinner" />
      <p className="loading-background__text">{title}</p>
    </div>
  );
};

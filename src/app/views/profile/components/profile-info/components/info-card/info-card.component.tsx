/* eslint-disable react/jsx-props-no-spreading */
import { DetailedHTMLProps, HTMLAttributes, FC, ReactNode } from 'react';
import classnames from 'classnames';

import './info-card.styles.scss';

interface InfoCardProps {
  icon?: ReactNode;
  value: number;
  description: string;
}

export const InfoCard: FC<
  InfoCardProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { className, icon, value, description, ...detailedHTMLProps } = props;

  return (
    <div {...detailedHTMLProps} className={classnames('info-card', className)}>
      <div className="info-card__stats">
        <div className="info-card__icon">{icon}</div>
        <div className="info-card__value">{value}</div>
      </div>
      <div className="info-card__description">{description}</div>
    </div>
  );
};

InfoCard.defaultProps = {
  className: '',
  icon: null,
  value: 0,
  description: ''
};

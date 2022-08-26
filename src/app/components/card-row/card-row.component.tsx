import { FC } from 'react';

import './card-row.styles.css';
import { OfferCard } from '../offer-card/offer-card.component';

interface CardRowProps {
  title: string;
  icon: any;
  assets: any;
}

export const CardRow: FC<CardRowProps> = (props) => {
  const { title, icon, assets } = props;
  return (
    <div className="card-row-wrapper">
      <div className="card-row-title">
        <img src={icon} className="title-icon" alt="card-row-icon" />
        {title}
      </div>
      <div className="card-row-container">
        {/* {assets && assets.map((asset: any) => <OfferCard asset={asset} key={asset.id} />)} */}
      </div>
    </div>
  );
};

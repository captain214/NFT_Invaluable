import React from 'react';
import { Link } from 'react-router-dom';

import './collection.styles.css';
import nextIcon from '../../../assets/images/next-icon.svg';
import flameIcon from '../../../assets/images/flame-icon.svg';
import verifiedIcon from '../../../assets/images/verified.svg';
import listIcon from '../../../assets/images/list-icon.svg';

import { OfferCard } from '../../components/offer-card/offer-card.component';
import { Routes } from '../../constants';

interface IProps {
  collection: any;
}

export const CollectionLayout: React.FunctionComponent<IProps> = ({ collection }: IProps) => {
  const { assets } = collection;
  const stats = {
    volume: 2,
    avg_price: 0.333
  };
  return (
    <div className="collection">
      <div className="collection-banner">
        {collection.banner_url && (
          <img src={collection.banner_url} alt="banner" className="collection-banner-image" />
        )}
        <div className="collection-image-wrapper">
          <div className="collection-image">
            <img src={collection.image_url} style={{ width: '100%' }} alt="" />
          </div>
        </div>
      </div>
      <div className="collection-title">
        <div className="collection-title-text">{collection.name}</div>
        <img src={verifiedIcon} alt="verified" />
      </div>

      <div className="collection-statistic">
        <div className="collection-statistic-tile">
          <div className="collection-statistic-tile-value">{assets.length}</div>
          <div className="collection-statistic-tile-title">items</div>
        </div>
        <div className="collection-statistic-tile">
          <div className="collection-statistic-tile-value">{2}</div>
          <div className="collection-statistic-tile-title">owners</div>
        </div>
        <div className="collection-statistic-tile">
          {stats?.volume ? (
            <div className="collection-statistic-tile-value">
              <img src={listIcon} alt="" className="collection-statistic-tile-value-icon" />
              {stats?.avg_price}
            </div>
          ) : (
            <div className="collection-statistic-tile-value">---</div>
          )}
          <div className="collection-statistic-tile-title">average price</div>
        </div>
        <div className="collection-statistic-tile">
          {stats?.volume ? (
            <div className="collection-statistic-tile-value">
              <img src={listIcon} alt="" className="collection-statistic-tile-value-icon" />
              {stats?.volume}
            </div>
          ) : (
            <div className="collection-statistic-tile-value">---</div>
          )}
          <div className="collection-statistic-tile-title">volume traded</div>
        </div>
      </div>
      <div className="collection-description">{collection.description}</div>
      <div className="collection-assets-header">
        <div className="collection-assets-header-title">
          <img src={flameIcon} alt="flame" />
          <div className="collection-assets-header-title-text">NEWLY MINTED</div>
        </div>
        <Link to={Routes.MARKETPLACE} className="collection-assets-header-link">
          <div className="collection-assets-header-link-text">VIEW ALL</div>
          <img src={nextIcon} alt="next" height="14" />
        </Link>
      </div>
      <div className="collection-assets-container">
        {assets.map((card: any) => (
          <OfferCard
            className="collection-assets-card"
            asset={card}
            key={card.id}
            collection={collection}
          />
        ))}
      </div>
    </div>
  );
};

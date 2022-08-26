import React, { FC } from 'react';
import cn from 'classnames';
import './drop-card.component.scss';
import { WithClassname } from '../../../../types/common/WithClassname';
import avatar from '../../../../../assets/images/avatar-placeholder.png';
import priceIcon from '../../../../../assets/images/price-icon.png';
import { normalizeEthPrice } from '../../../../../utils/eth-utils';

interface IProps {
  title: string;
  creator: string;
  imageUrl: string;
  minBid?: number;
  maxBid?: number;
  price?: string;
}

// TODO: Replace/merge with offer-card?
export const DropCard: FC<IProps & WithClassname> = (props) => {
  const { imageUrl, creator, title, minBid, maxBid, price } = props;
  return (
    <div className={cn('drop-card-root', props.className)}>
      <div className="drop-card-image-wrapper" style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className="bottom">
        <div className="bottom__info">
          <div className="bottom__creator">
            <img src={avatar} alt="avatar" className="bottom__creator-avatar" />
            <span className="bottom__creator-username">{creator}</span>
          </div>
          <p className="bottom__title">{title}</p>
        </div>
        <div className="bottom__prices">
          {minBid && (
            <div className="price price--min-bid">
              <p className="price-title">Min</p>
              <div className="price-value-wrapper">
                <img src={priceIcon} className="price-icon" alt="price icon" />
                <span className="price-value">{normalizeEthPrice(minBid)}</span>
              </div>
            </div>
          )}
          {maxBid && (
            <div className="price price--max-bid">
              <p className="price-title">Highest</p>
              <div className="price-value-wrapper">
                <img src={priceIcon} className="price-icon" alt="price icon" />
                <span className="price-value">{normalizeEthPrice(maxBid)}</span>
              </div>
            </div>
          )}
          {!maxBid && !minBid && price && (
            <div className="price">
              <div className="price-value-wrapper">
                <img src={priceIcon} className="price-image" alt="price icon" />
                <span className="price-value">{normalizeEthPrice(price)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

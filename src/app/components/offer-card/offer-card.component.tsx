import { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { isPast } from 'date-fns';
import priceIcon from '../../../assets/images/price-icon.png';
import { getDiffTime } from '../../../utils/time-utils';
import { normalizeEthPrice } from '../../../utils/eth-utils';
import { TokenType } from '../../../constants/token-type.enum';
import type { Asset } from '../../../types/asset';
import { Avatar } from '../avatar/avatar.component';

import './offer-card.styles.css';
import { FavoriteButton } from '../favorite-button/favorite-button.component';

interface IOfferCard {
  asset: Asset;
  order?: any;
  collection?: any;
  theme?: 'dark' | 'light';
  width?: string;
  onUpdate?: () => unknown;
}

export const OfferCard: FC<
  IOfferCard & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { asset, order, collection, theme = 'dark', width = '252px', onUpdate } = props;
  const getLeftTime = (time: string) => {
    const { days, hours, minutes } = getDiffTime(Date.now(), time, -new Date().getTimezoneOffset());
    if (days) {
      return days === 1 ? 'a day left' : `${days} days left`;
    }
    if (hours) {
      return hours === 1 ? 'an hour left' : `${hours} hours left`;
    }
    return minutes === 1 ? 'a minute left' : `${minutes} minutes left`;
  };

  const isShow = useMemo(() => {
    return isPast(new Date(asset.show_time));
  }, [asset]);

  const link =
    isShow && asset.address && (asset.token_id || asset.token_id === 0)
      ? `/item/${asset.address}/${asset.token_id}`
      : '#';

  return (
    <Link
      to={link}
      style={{ width }}
      className={cn(props.className, 'offer-card-wrapper', `offer-card-wrapper__${theme}`, {
        'no-pointer': !isShow
      })}
    >
      <div className={cn('offer-card-header', `offer-card-header__${theme}`)}>
        {(asset.type === TokenType.ERC721.toString() || asset.balances?.length === 1) &&
          (asset.balances[0].user.avatar ? (
            <div className="offer-card-avatar-container">
              <div className="offer-card-avatar">
                <Avatar
                  src={asset.balances[0].user.avatar}
                  alt="Owner avatar."
                  hasVerificationStamp
                />
              </div>
            </div>
          ) : (
            <div className="offer-card-avatar">
              <Avatar src={asset.balances[0].user.avatar} alt="Owner avatar." />
            </div>
          ))}
        {asset.type === TokenType.ERC1155.toString() && asset.balances?.length > 1 && (
          <div>{asset.balances.length} owners</div>
        )}
        <FavoriteButton asset={asset} onUpdate={onUpdate} />
      </div>
      <div className="offer-card-image-wrapper">
        <img src={asset.image_url} className="offer-card-image" alt="offer card" />
      </div>
      <div className="offer-card-footer">
        <div className="offer-card-info">
          <div className="offer-card-title">
            {asset.title || asset.collection.name || collection.name}
          </div>
        </div>
        <div className="offer-card-price">
          <div className="offer-card-price-title">Price</div>
          <div className="offer-card-price-value">
            <img src={priceIcon} className="price-icon" alt="price icon" />
            <div>{normalizeEthPrice(asset.current_price)} ETH</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

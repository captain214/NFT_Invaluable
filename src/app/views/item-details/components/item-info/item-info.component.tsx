import { DetailedHTMLProps, FC, HTMLAttributes, useEffect } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { ReactComponent as Group } from '../../../../../assets/images/group-icon.svg';
import { Avatar } from '../../../../components/avatar/avatar.component';
import type { User } from '../../../../../types/user';
import './item-info.style.scss';
import { FavoriteButton } from '../../../../components/favorite-button/favorite-button.component';
import { Asset } from '../../../../../types/asset';

interface ItemInfoProps {
  asset: Asset;
}

export const ItemInfo: FC<
  ItemInfoProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { asset, ...htmlDivElementProps } = props;
  const { title, collection } = asset;
  const owners = asset.balances.map((balance: { user: User }) => balance.user);

  const link = owners && owners.length && owners[0]?.address ? `/users/${owners[0].address}` : '#';

  useEffect(() => {
    console.log('props:', props);
  }, []);

  return (
    <div {...htmlDivElementProps} className={cn(props.className, 'item-info')}>
      <div className="item-info__author author">
        {owners.length > 1 ? (
          <>
            <Group className="author__icon" />
            <span>{`${owners.length} owners`}</span>
          </>
        ) : (
          <>
            <div className="author__avatar">
              <Avatar src={owners[0].avatar} />
            </div>
            <span>Owned by</span>
            <Link to={link} className="author__link link streak-link">
              {owners[0]?.name || owners[0]?.address.substr(2, 6).toUpperCase()}
            </Link>
          </>
        )}
      </div>
      <div className="item-info__wrapper">
        <h2 className="item-info__title">{title}</h2>
        <div className="item-info__favorites">
          <FavoriteButton asset={asset} />
        </div>
      </div>
    </div>
  );
};

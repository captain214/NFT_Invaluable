import React, { FC } from 'react';
import cn from 'classnames';
import './highest-bid.styles.scss';

import avatar from '../../../../../assets/images/avatar-placeholder.png';
import { WithClassname } from '../../../../types/common/WithClassname';
import { normalizeEthPrice } from '../../../../../utils/eth-utils';

interface IProps {
  bid?: any;
  count?: number;
}

export const HighestBid: FC<IProps & WithClassname> = (props) => {
  const { bid, count = 0 } = props;

  if (!bid) {
    return (
      <div className={cn('highest-bid-root', props.className)}>
        <div className="no-data">No bids yet!</div>
      </div>
    );
  }
  return (
    <div className={cn('highest-bid-root', props.className)}>
      <div className="bid-info">
        <p className="bid-info__title">Highest bid</p>
        <p className="bid-info__value">{normalizeEthPrice(bid.price)} ETH</p>
        <p className="bid-info__position">#1 of #{count}</p>
      </div>
      <div className="bid-creator">
        <p className="bid-creator__title">Done by</p>
        <div className="bid-creator__user">
          <img src={avatar} alt="avatar" className="bid-creator__avatar" />
          <span className="bid-creator__username">{bid.from_account}</span>
        </div>
      </div>
    </div>
  );
};

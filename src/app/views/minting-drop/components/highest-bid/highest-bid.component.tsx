import React, { FC } from 'react';
import cn from 'classnames';
import './highest-bid.styles.scss';

import avatar from '../../../../../assets/images/avatar-placeholder.png';
import { WithClassname } from '../../../../types/common/WithClassname';

export const HighestBid: FC<WithClassname> = (props) => {
  return (
    <div className={cn('highest-bid-root', props.className)}>
      <div className="bid-info">
        <p className="bid-info__title"># OF NFT’S MINTED</p>
        <p className="bid-info__value">420/6,000</p>
      </div>
    </div>
  );
};

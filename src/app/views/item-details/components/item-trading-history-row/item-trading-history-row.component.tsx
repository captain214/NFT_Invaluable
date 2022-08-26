import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './item-trading-history-row.styles.scss';

import { Table } from '../../../../components/table/table.component';
import { getDiffTime } from '../../../../../utils/time-utils';
import { formatAddress, isNullAddress, normalizeEthPrice } from '../../../../../utils/eth-utils';
import { TokenType } from '../../../../../constants/token-type.enum';

interface IProps {
  event: any;
  type: any;
}

export const ItemTradingHistoryRow: FC<IProps> = (props) => {
  const { event = {}, type } = props;

  const getDate = (): string => {
    if (!props.event.created_at) return '';
    const { days, hours, minutes } = getDiffTime(props.event.created_at, Date.now());
    if (days) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    if (hours) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    return minutes <= 1 ? 'just now' : `${minutes} minutes ago`;
  };

  const eventType = event.type;
  const typeToName: Record<string, string> = {
    CREATE: 'Create',
    OFFER: 'Offer',
    UNLIST: 'Cancel'
  };

  const from = event.from_user;
  const to = event.to_user;
  const price = event.price || event.bid_amount || event.ending_price;
  const { quantity } = event;

  const getTypeName = () => {
    if (eventType === 'TRANSFER') {
      return event.price && event.price !== '0' ? 'Sold' : 'Transfer';
    }
    return typeToName[eventType];
  };
  return (
    <Table.Row className="trading-history-row-root" key={event.id}>
      <Table.Cell>{getTypeName()}</Table.Cell>
      <Table.Cell>{price && normalizeEthPrice(price)}</Table.Cell>
      {type === TokenType.ERC1155 && <Table.Cell>{quantity}</Table.Cell>}
      <Table.Cell>
        {from && !isNullAddress(from.address) && (
          <>
            {from.avatar && <img className="avatar" src={from.profile_img_url} alt="" />}
            <Link className="streak-link from-username" to="/#">
              {formatAddress(from.address) || 'Unnamed'}
            </Link>
          </>
        )}
      </Table.Cell>
      <Table.Cell>
        {to && !isNullAddress(to.address) && (
          <>
            {to.avatar && <img className="avatar" src={to.avatar} alt="" />}
            <Link className="streak-link to-username" to="/#">
              {formatAddress(to.address) || 'Unnamed'}
            </Link>
          </>
        )}
      </Table.Cell>
      <Table.Cell>{getDate()}</Table.Cell>
    </Table.Row>
  );
};

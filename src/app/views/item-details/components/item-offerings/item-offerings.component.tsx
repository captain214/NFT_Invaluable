import React, { FC } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { WithClassname } from '../../../../types/common/WithClassname';

import './item-offerings.style.scss';
import { Table } from '../../../../components/table/table.component';
import { normalizeEthPrice } from '../../../../../utils/eth-utils';
import { getDiffTime } from '../../../../../utils/time-utils';

interface IProps {
  orders?: any[];
}

export const ItemOfferings: FC<IProps & WithClassname> = ({ orders = [], className }) => {
  const getTokenPrice = (order: any) => Number(normalizeEthPrice(order.price));
  const getUsdPrice = (order: any) => {
    const usdPrice = Number(order.payment_token_contract?.usd_price || 1800);
    return (getTokenPrice(order) * usdPrice).toFixed(2);
  };
  const getExpiration = (order: any): string => {
    const { minutes, hours, days } = getDiffTime(
      Date.now(),
      new Date(order.expiration_time).getTime()
    );
    if (days !== 0) return days === 1 ? 'in a day' : `in ${days} days`;
    if (hours !== 0) return hours === 1 ? 'in an hour' : `in ${hours} hours`;
    return minutes === 1 ? 'in a minute' : `in ${minutes} minutes`;
  };

  if (orders.length === 0) {
    return (
      <div className={cn(className, 'item-offerings-root')}>
        <div className="no-data">No offerings yet.</div>
      </div>
    );
  }

  return (
    <div className={cn(className, 'item-offerings-root')}>
      <Table className="table">
        <Table.Row isHeader>
          <Table.Cell>Price</Table.Cell>
          <Table.Cell>USD Price</Table.Cell>
          <Table.Cell>Expiration</Table.Cell>
          <Table.Cell>From</Table.Cell>
        </Table.Row>
        {orders.map((i) => (
          <Table.Row key={i.salt}>
            <Table.Cell>
              <img className="token-image" src={i.payment_token_contract?.image_url} alt="" />
              <b>{getTokenPrice(i)}</b>
              <span> {i.payment_token_contract?.symbol}</span>
            </Table.Cell>
            <Table.Cell>${getUsdPrice(i)}</Table.Cell>
            <Table.Cell>{getExpiration(i)}</Table.Cell>
            <Table.Cell>
              <Link className="streak-link" to="#/to">
                {i.creator || 'Unnamed'}
              </Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};

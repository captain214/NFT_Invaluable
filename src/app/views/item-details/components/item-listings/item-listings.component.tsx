import React, { FC } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { WithClassname } from '../../../../types/common/WithClassname';
import priceIcon from '../../../../../assets/images/price-icon.png';

import './item-listings.style.scss';
import { Table } from '../../../../components/table/table.component';
import { formatAddress, normalizeEthPrice } from '../../../../../utils/eth-utils';
import { GradientButton } from '../../../../components/gradient-button/gradient-button.component';
import { TokenType } from '../../../../../constants/token-type.enum';
import { Order } from '../../../../types/api/Order';

interface IProps {
  orders?: Order[];
  type: string;
  loading?: boolean;
  handleBuy?: (order: Order) => void;
  handleUnlist?: (order: Order) => void;
}

export const ItemListings: FC<IProps & WithClassname> = ({
  className,
  orders = [],
  type,
  loading = false,
  handleBuy,
  handleUnlist
}) => {
  const { account } = useWeb3React();
  const getTokenPrice = (order: any) => Number(normalizeEthPrice(order.price));
  const getUsdPrice = (order: any) => {
    const usdPrice = Number(order.payment_token_contract?.usd_price || 1800);
    return (getTokenPrice(order) * usdPrice).toFixed(2);
  };

  const handleRowAction = (order: Order) => () => {
    if (order.creator.address === account) {
      handleUnlist?.(order);
    } else {
      handleBuy?.(order);
    }
  };

  if (orders.length === 0) {
    return (
      <div className={cn(className, 'item-listings-root')}>
        <div className="no-data">No active orders yet.</div>
      </div>
    );
  }

  return (
    <div className={cn(className, 'item-listings-root')}>
      <Table className="table">
        {type === 'ERC1155' ? (
          <Table.Row isHeader>
            <Table.Cell>Unit Price</Table.Cell>
            <Table.Cell>USD Unit Price</Table.Cell>
            <Table.Cell>Quantity</Table.Cell>
            <Table.Cell />
            <Table.Cell>Expiration</Table.Cell>
            <Table.Cell>From</Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row isHeader>
            <Table.Cell>Price</Table.Cell>
            <Table.Cell>USD Price</Table.Cell>
            <Table.Cell />
            <Table.Cell>Expiration</Table.Cell>
            <Table.Cell>From</Table.Cell>
          </Table.Row>
        )}

        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell className="price-cell">
              <img className="token-image" src={priceIcon} alt="" />
              <b>{getTokenPrice(order)} ETH</b>
            </Table.Cell>
            <Table.Cell>${getUsdPrice(order)}</Table.Cell>
            {type === TokenType.ERC1155 && <Table.Cell>{order.quantity}</Table.Cell>}
            <Table.Cell>
              <GradientButton
                loading={loading}
                onClick={handleRowAction(order)}
                className="buy-btn"
                variant="filled"
                size="small"
              >
                {order.creator?.address === account ? 'Cancel' : 'Buy now'}
              </GradientButton>
            </Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>
              <Link className="streak-link" to="#/to">
                {order.creator?.address === account
                  ? 'You'
                  : formatAddress(order.creator?.address) || order.creator || 'Unnamed'}
              </Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};

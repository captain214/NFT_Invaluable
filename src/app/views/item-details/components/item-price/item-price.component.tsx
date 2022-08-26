import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import './item-price.style.scss';

import { BigNumber } from '@ethersproject/bignumber';
import { WithClassname } from '../../../../types/common/WithClassname';
import { normalizeEthPrice } from '../../../../../utils/eth-utils';
import { GradientButton } from '../../../../components/gradient-button/gradient-button.component';
import priceIcon from '../../../../../assets/images/price-icon.png';

interface IProps {
  balances?: any[];
  orders?: any[];
  account?: string | null;
  loading?: boolean;
  handleList: () => unknown;
  handleBuy: () => void;
  handleUnlist: () => void;
}

export const ItemPrice: FC<IProps & WithClassname> = (props) => {
  const {
    balances,
    orders,
    account,
    loading = false,
    className,
    handleBuy,
    handleUnlist,
    handleList
  } = props;
  const lastOrder = orders && orders.find(Boolean);

  const amountOwned: number = useMemo(() => {
    return (
      balances?.reduce((prev: number, curr: any) => {
        return curr.user.address === account ? prev + curr.quantity : prev;
      }, 0) || 0
    );
  }, [balances, account]);

  const amountOwnedOnSale: number = useMemo(() => {
    const yourActiveOrders = orders?.filter(
      (i: any) => i.side === 'SELL' && i.status === 'ACTIVE' && i.creator.address === account
    );
    return yourActiveOrders?.reduce((prev: number, curr: any) => curr.quantity + prev, 0) || 0;
  }, [orders, account]);

  const amountBuyable: number = useMemo(() => {
    const yourActiveOrders = orders?.filter(
      (i: any) => i.side === 'SELL' && i.status === 'ACTIVE' && i.creator.address !== account
    );
    return yourActiveOrders?.reduce((prev: number, curr: any) => curr.quantity + prev, 0) || 0;
  }, [orders, account]);
  const amountOwnedSaleable = amountOwned - amountOwnedOnSale;

  const getTokenPrice = (order: any) => {
    const total = BigNumber.from(order.price).mul(order.quantity);
    return normalizeEthPrice(total.toString());
  };

  const handleBuyClick = () => handleBuy();
  const handleSellClick = () => handleList();
  const handleCancelClick = () => handleUnlist();

  if (amountOwned === 0 && amountBuyable === 0) return null;
  return (
    <div className="floating-price">
      <div className={cn(className, 'item-price')}>
        {lastOrder && (
          <div className="item-price__info">
            <p className="item-price__title">Current price</p>
            <p className="item-price__value">
              {getTokenPrice(lastOrder)} ETH
              <img src={priceIcon} className="price-icon" alt="price icon" />
            </p>
          </div>
        )}
        {!loading && account && amountBuyable > 0 && (
          <GradientButton className="item-price__btn" variant="filled" onClick={handleBuyClick}>
            Buy now
          </GradientButton>
        )}
        {!loading && account && amountOwnedSaleable > 0 && (
          <GradientButton className="item-price__btn" variant="filled" onClick={handleSellClick}>
            Sell by fixed price
          </GradientButton>
        )}
        {!loading && account && amountOwnedOnSale > 0 && (
          <GradientButton className="item-price__btn" onClick={handleCancelClick}>
            Cancel
          </GradientButton>
        )}
      </div>
    </div>
  );
};

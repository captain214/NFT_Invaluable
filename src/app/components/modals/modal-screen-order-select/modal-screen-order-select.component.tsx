import { FC, useMemo, useState } from 'react';

import './modal-screen-order-select.styles.scss';
import { BigNumber } from '@ethersproject/bignumber';
import cn from 'classnames';
import { Order } from '../../../types/api/Order';
import { formatAddress, normalizeEthPrice } from '../../../../utils/eth-utils';
import { Dropdown, ISuggestion } from '../../dropdown/dropdown.component';
import { Checkbox } from '../../checkbox/checkbox.component';
import { GradientButton } from '../../gradient-button/gradient-button.component';

interface IProps {
  orders: Order[];
  title?: string;
  showCreator?: boolean;
  onOrderSelect?: (order: Order) => unknown;
}

export const ModalScreenOrderSelect: FC<IProps> = (props) => {
  const { orders, title = 'Make a Selection', showCreator = false, onOrderSelect } = props;
  const sortSuggestions = [
    { id: 'price', value: 'Price (Highest First)', order: 'ASC' },
    { id: 'price', value: 'Price (Lowest First)', order: 'DESC' },
    { id: 'quantity', value: 'Quantity (Highest First)', order: 'ASC' },
    { id: 'quantity', value: 'Quantity (Lowest First)', order: 'DESC' }
  ];

  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [currentSortType, setCurrentSortType] = useState(sortSuggestions[0]);
  const handleOrderSelect = (order: Order) => () => {
    setSelectedOrder(order);
  };

  const handleSelectClick = () => {
    if (selectedOrder) onOrderSelect?.(selectedOrder);
  };

  const handleSortChange = (value: ISuggestion) => {
    setCurrentSortType(value as ISuggestion & { order: 'ASC' | 'DESC' });
  };

  const processedOrders = useMemo(() => {
    return orders.sort((a, b) => {
      switch (currentSortType?.id) {
        case 'price': {
          const priceA = BigNumber.from(a.price);
          const priceB = BigNumber.from(b.price);
          if (priceA.lt(priceB)) {
            return currentSortType?.order === 'DESC' ? -1 : 1;
          }
          if (priceA.gt(priceB)) {
            return currentSortType?.order === 'DESC' ? 1 : -1;
          }
          return 0;
        }
        case 'quantity': {
          return currentSortType?.order === 'DESC'
            ? a.quantity - b.quantity
            : b.quantity - a.quantity;
        }
        default:
          return 0;
      }
    });
  }, [orders, currentSortType]);

  return (
    <div className="modal-order-select">
      <div className="modal-order-select__top">
        <span className="modal-order-select__top-text">{title}</span>
        <div className="modal-order-select__sort">
          <span className="modal-order-select__sort-text">Sort by</span>
          <Dropdown
            className="modal-order-select__sort-dropdown"
            suggestions={sortSuggestions}
            defaultValue={sortSuggestions[0]}
            variant="filled"
            filledColor="#201C21"
            onChange={handleSortChange}
          />
        </div>
      </div>
      <div className="modal-order-select__divider" />
      <div className="modal-order-select__available">{processedOrders.length} available</div>
      {processedOrders.map((i, index) => (
        <div
          className={cn(
            'modal-order-select__item',
            selectedOrder === i && 'modal-order-select__item--selected'
          )}
          key={i.id}
          onClick={handleOrderSelect(i)}
          onKeyPress={() => {}}
          role="button"
          tabIndex={0}
        >
          <div className="modal-order-select__index">#{index + 1}</div>
          <div className="modal-order-select__price">
            {normalizeEthPrice(i.price)} ETH (Quantity: {i.quantity})
          </div>
          {showCreator && (
            <div className="modal-order-select__creator">{formatAddress(i.creator.address)}</div>
          )}
          <Checkbox
            tabIndex={-1}
            className="modal-order-select__checkbox"
            checked={selectedOrder === i}
          />
        </div>
      ))}
      <GradientButton
        className="modal-order-select__select-btn"
        variant="filled"
        disabled={!selectedOrder}
        onClick={handleSelectClick}
      >
        Select
      </GradientButton>
    </div>
  );
};

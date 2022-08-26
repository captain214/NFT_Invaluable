import React, { useState } from 'react';
import cn from 'classnames';

import './marketplace-filter.styles.css';
import { useMarketplaceFilter } from '../MarketplaceFilterProvider/marketplace-filter-context';
import { FilterType, IFilter } from '../../marketplace.interfaces';

import tunerIcon from '../../../../../assets/images/tuner-icon.svg';
import filterIcon from '../../images/filter-icon.png';
import { Avatar } from '../../../../components/avatar/avatar.component';

const filterTitles: Record<string, string> = {
  new: 'New',
  on_auction: 'On Auction',
  // hot_offer: 'Hot Offer',
  buy_now: 'Buy Now',
  highest_price: 'Highest Price',
  floor_price: 'Floor Price'
};

export const MarketplaceFilter: React.FunctionComponent = () => {
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  function onResizeFunction() {
    setDeviceWidth(window.innerWidth);
  }

  window.addEventListener('resize', onResizeFunction);
  window.addEventListener('load', onResizeFunction);

  const filter = useMarketplaceFilter();

  const tagFilterMenu = () => {
    setIsFilterMenuVisible((prev) => !prev);
  };

  const setFilter = (value: FilterType) => {
    if (value === FilterType.FLOOR_PRICE) {
      filter.remove(FilterType.HIGHEST_PRICE);
    }
    if (value === FilterType.HIGHEST_PRICE) {
      filter.remove(FilterType.FLOOR_PRICE);
    }
    if (value === FilterType.NEW) {
      filter.remove(FilterType.BUY_NOW);
      filter.remove(FilterType.ON_AUCTION);
    }
    if (value === FilterType.BUY_NOW) {
      filter.remove(FilterType.NEW);
      filter.remove(FilterType.ON_AUCTION);
    }
    if (value === FilterType.ON_AUCTION) {
      filter.remove(FilterType.BUY_NOW);
      filter.remove(FilterType.NEW);
    }
    filter.add({
      id: value,
      title: filterTitles[value as string],
      type: value
    });
    setIsFilterMenuVisible(false);
  };

  return (
    <>
      <div className="marketplace-filter">
        <div className="marketplace-filter-tags">
          <button
            type="button"
            className={cn('marketplace-filter-tag', {
              'marketplace-filter-tag__active': !filter.state.length
            })}
            onClick={filter.clear}
          >
            View all
          </button>
          {filter.state.map((item: IFilter) => (
            <button
              key={item.id}
              type="button"
              title="remove filter"
              className="marketplace-filter-tag marketplace-filter-tag__active"
              onClick={() => filter.remove(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        {deviceWidth > 767 ? (
          <button
            type="button"
            className="marketplace-filter-tag marketplace-filter-tag__active marketplace-filter-btn"
            onClick={tagFilterMenu}
          >
            <img src={tunerIcon} className="marketplace-filter-btn-icon" alt="filter" />
            Filter/Sorting
          </button>
        ) : (
          <Avatar
            style={{ width: '40px' }}
            className="menu-icon hamburger-icon"
            src={filterIcon}
            onClick={tagFilterMenu}
          />
        )}
        <div
          className={cn('marketplace-filters-menu', {
            'marketplace-filters-menu__visible': isFilterMenuVisible
          })}
        >
          <div className="filters-menu-title">Status</div>
          <button
            type="button"
            className="filters-menu-item"
            onClick={() => setFilter(FilterType.NEW)}
          >
            New
          </button>
          <button
            type="button"
            className="filters-menu-item"
            onClick={() => setFilter(FilterType.ON_AUCTION)}
          >
            On Auction
          </button>
          <button
            type="button"
            className="filters-menu-item"
            onClick={() => setFilter(FilterType.BUY_NOW)}
          >
            Buy Now
          </button>
          <div className="filters-menu-title">Price</div>
          <button
            type="button"
            className="filters-menu-item"
            onClick={() => setFilter(FilterType.HIGHEST_PRICE)}
          >
            Highest Price
          </button>
          <button
            type="button"
            className="filters-menu-item"
            onClick={() => setFilter(FilterType.FLOOR_PRICE)}
          >
            Floor Price
          </button>
        </div>
      </div>
    </>
  );
};

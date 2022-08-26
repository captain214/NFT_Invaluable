import React from 'react';
import cn from 'classnames';

import './status-filter.styles.css';
import { statusFilters } from '../../../../../metadata/status-filter.metadata';
import { useMarketplaceFilter } from '../MarketplaceFilterProvider/marketplace-filter-context';
import { IFilter } from '../../marketplace.interfaces';

export const StatusFilter: React.FunctionComponent = () => {
  const filter = useMarketplaceFilter();
  const isFilterActive = (id: string) => {
    return filter.state.some((el) => el.id === id);
  };
  const toggleStatusFilterItem = (item: IFilter) => {
    if (isFilterActive(item.id)) {
      filter.remove(item.id);
    } else {
      filter.add(item);
    }
  };
  return (
    <div className="status-filter">
      {statusFilters.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn('status-filter-btn', {
            'status-filter-btn__active': isFilterActive(item.id)
          })}
          onClick={() => toggleStatusFilterItem(item)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

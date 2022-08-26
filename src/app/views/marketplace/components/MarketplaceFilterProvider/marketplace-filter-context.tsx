import React, { useContext, useState } from 'react';
import { IFilter } from '../../marketplace.interfaces';

const MarketplaceFilterContextDefault = {
  state: [] as IFilter[],
  add: (value: IFilter) => {},
  remove: (id: string) => {},
  clear: () => {}
};

type TMarketplaceFilterContext = typeof MarketplaceFilterContextDefault;

export const MarketplaceFilterContext = React.createContext<TMarketplaceFilterContext>(
  MarketplaceFilterContextDefault
);

export const useMarketplaceFilter = () => {
  return useContext(MarketplaceFilterContext);
};

export const MarketplaceFilterProvider: React.FC = (props: { children?: React.ReactNode }) => {
  const [marketplaceFilter, setMarketplaceFilter] = useState<IFilter[]>([]);

  const removeFilter = (id: string) => {
    setMarketplaceFilter((prev) => prev.filter((el) => el.id !== id));
  };
  const addFilter = (value: IFilter) => {
    if (marketplaceFilter.some((el) => el.id === value.id)) {
      removeFilter(value.id);
    }
    setMarketplaceFilter((prev) => [...prev, value]);
  };
  const clearFilter = () => {
    setMarketplaceFilter([]);
  };

  const filter: TMarketplaceFilterContext = {
    state: marketplaceFilter,
    add: addFilter,
    remove: removeFilter,
    clear: clearFilter
  };

  return (
    <MarketplaceFilterContext.Provider value={filter}>
      {props.children}
    </MarketplaceFilterContext.Provider>
  );
};

MarketplaceFilterProvider.defaultProps = {
  children: null
};

import React from 'react';
import './applied-filter.styles.css';
import crossIcon from '../../../../../assets/images/cross-icon.svg';
import { IFilter } from '../../marketplace.interfaces';
import { useMarketplaceFilter } from '../MarketplaceFilterProvider/marketplace-filter-context';

interface IProps {
  item: IFilter;
}

export const AppliedFilter: React.FunctionComponent<IProps> = (props: IProps) => {
  const filter = useMarketplaceFilter();
  return (
    <div className="applied-filter-container">
      <div className="applied-filter-title">{props.item.title}</div>
      <button
        type="button"
        className="applied-filter-btn"
        onClick={() => filter.remove(props.item.id)}
      >
        <img src={crossIcon} alt="cross" />
      </button>
    </div>
  );
};

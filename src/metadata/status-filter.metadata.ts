import { FilterType, IFilter } from '../app/views/marketplace/marketplace.interfaces';

export const statusFilters: IFilter[] = [
  { id: 'has_order', title: 'Buy now', type: FilterType.BUY_NOW },
  { id: 'on_auction', title: 'On Auction', type: FilterType.ON_AUCTION }
];

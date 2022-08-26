export enum FilterType {
  // COLLECTION_SLUG = 'collection_slug',
  // MIN_PRICE = 'min_price',
  // MAX_PRICE = 'max_price',
  // CATEGORY = 'category',
  // HAS_ORDER = 'has_order',
  ON_AUCTION = 'on_auction',
  NEW = 'new',
  // HOT_OFFER = 'hot_offer',
  BUY_NOW = 'buy_now',
  HIGHEST_PRICE = 'highest_price',
  FLOOR_PRICE = 'floor_price',
  SEARCH = 'search'
}

export interface IFilter {
  id: string;
  title: string;
  type: FilterType;
  value?: number | string;
}

export interface ISortOrder {
  by: string;
  direction: string;
}

export interface ICollection {
  name: string;
  slug: string;
  image_url: string;
  banner_image_url?: string;
  description?: string;
}

export interface IAsset {
  name: string;
  permalink: string;
  favoritesQuantity: number;
  image_url: string;
  collection: ICollection;
  asset_contract?: any;
  token_id?: string;
}

export interface IAssesOrder {
  id: number;
  current_price: number;
  closing_date: string;
  asset: IAsset;
}

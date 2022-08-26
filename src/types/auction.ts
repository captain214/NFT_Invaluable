import type { Asset } from './asset';

export enum Type {
  AUCTION_CREATED = 'AUCTION_CREATED',
  AUCTION_CANCELLED = 'AUCTION_CANCELLED',
  BID_PLACED = 'BID_PLACED',
  FUNDS_CLAIMED = 'FUNDS_CLAIMED',
  ITEM_CLAIMED = 'ITEM_CLAIMED'
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export interface Event {
  id: string;
  auction: Auction;
  type: Type;
  chain_id: string;
  price: number;
  from_account: string;
  created_at: Date;
}

export interface Auction {
  id: string;
  asset: Asset;
  cancelled: boolean;
  item_claimed: boolean;
  chain_id: string;
  beneficiary: string;
  token_id: number;
  bid_step: number;
  starting_bid: number;
  start_date: Date;
  end_date: Date;
  accept_erc20: boolean;
  is_erc1155: boolean;
  quantity: number;
  fee_rate: number;
  overtime_seconds: number;
  address: string;
  created_at: Date;
  status: Status;
  events: Event[];
}

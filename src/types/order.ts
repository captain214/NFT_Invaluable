import type { Asset } from './asset';
import type { User } from './user';

export enum Type {
  FIX_PRICE = 'FIX_PRICE',
  AUCTION = 'AUCTION',
  BID = 'BID'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING'
}

export enum Side {
  SELL = 'SELL',
  BUY = 'BUY'
}

export interface Order {
  id: string;
  asset: Asset;
  price: number;
  expiration_time: Date;
  creator: User;
  taker: User;
  type: Type;
  status: Status;
  side: Side;
  created_at: Date;
  updated_at: Date;
  offer_id: string;
  quantity: number;
}

import type { Asset } from './asset';
import type { Balance } from './balance';
import type { EventLog } from './event-log';
import type { Order } from './order';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
  address: string;
  name: string;
  role: Role;
  avatar: string;
  banner: string;
  about: string;
  nonce: string;
  favorites: string[];
  balances: Balance[];
  assets: Asset[];
  fromEvents: EventLog[];
  toEvents: EventLog[];
  creatorOrders: Order[];
  takerOrders: Order[];
}

import type { Auction } from './auction';
import type { Balance } from './balance';
import type { Collection } from './collection';
import type { Order } from './order';
import type { User } from './user';
import { Type as TokenType } from './token';

export enum Role {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface Asset {
  id: string;
  token_id: number;
  address: string;
  title: string;
  description: string;
  image_url: string;
  creator: User;
  type: TokenType;
  chain_id: string;
  favorites_count: number;
  collection: Collection;
  role: Role;
  created_at: Date;
  properties: string;
  updated_at: Date;
  balances: Balance[];
  orders: Order[];
  auctions: Auction[];
  current_price: number;
  show_time: Date;
}

import type { Asset } from './asset';
import type { User } from './user';

export enum Type {
  CREATE = 'CREATE',
  TRANSFER = 'TRANSFER',
  OFFER = 'OFFER',
  BID = 'BID',
  SALE = 'SALE',
  UNLIST = 'UNLIST'
}

export interface EventLog {
  id: string;
  created_at: Date;
  type: Type;
  asset: Asset;
  from_user: User;
  to_user: User;
  price: number;
  quantity: number;
  timestamp: number;
}

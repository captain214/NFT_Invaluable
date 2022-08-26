import type { User } from './user';
import type { Asset } from './asset';

export interface Balance {
  id: string;
  asset: Asset;
  user: User;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

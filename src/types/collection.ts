import type { Asset } from './asset';
import type { Category } from './category';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_url: string;
  category: Category;
  assets: Asset[];
  created_at: Date;
}

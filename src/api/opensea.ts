import { QueryFunctionContext } from 'react-query';
import { createSearchParams } from './utils/createSearchParams';

export const getCollections = (): Promise<any> => {
  const url = 'https://api.opensea.io/api/v1/collections?offset=0&limit=300';
  const options = { method: 'GET' };

  return fetch(url, options).then((res) => res.json());
};

export const getAssets = (query: Record<string, any>): Promise<any> => {
  const inputQuery = {
    order_direction: 'desc',
    offset: 0,
    limit: 24,
    ...query
  };
  const url = `https://api.opensea.io/api/v1/assets?${createSearchParams(inputQuery)}`;
  const options = { method: 'GET' };

  return fetch(url, options).then((res) => res.json());
};

export const ORDER_PAGINATION_LIMIT = 48;

export const getOrders = ({ queryKey, pageParam = 0 }: QueryFunctionContext): Promise<any> => {
  const [key, { by, direction }] = queryKey as any[];

  const url = `https://api.opensea.io/wyvern/v1/orders?bundled=false&include_bundled=false&include_invalid=false&limit=${ORDER_PAGINATION_LIMIT}&offset=${pageParam}&order_by=${by}&order_direction=${direction}`;
  const options = { method: 'GET', headers: { Accept: 'application/json' } };

  return fetch(url, options).then((res) => res.json());
};

export const getSingleAsset = (assetAddress: string, tokenId: string): Promise<any> => {
  const url = `https://api.opensea.io/api/v1/asset/${assetAddress}/${tokenId}`;
  return fetch(url).then((res) => res.json());
};

export const getOrdersByQuery = (query: Record<string, any>): Promise<any> => {
  const inputQuery = {
    bundled: false,
    include_bundled: false,
    include_invalid: false,
    limit: 48,
    offset: 0,
    ...query
  };

  const url = `https://api.opensea.io/wyvern/v1/orders?${createSearchParams(inputQuery)}`;
  return fetch(url).then((res) => res.json());
};

export const getEvents = (query: Record<string, any>): Promise<any> => {
  const inputQuery = {
    ...query
  };

  const url = `https://api.opensea.io/api/v1/events?${createSearchParams(inputQuery)}`;
  return fetch(url).then((res) => res.json());
};

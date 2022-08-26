import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import { User } from '../types/user';
import DropMintingContract from '../app/contract/abi/MintingDrop.abi.json';
import { createFetch } from './createFetch';
import { getMetamaskBackendToken } from './metaAuth';
import { createSearchParams, Query } from './utils/createSearchParams';

export const getSingleAsset = (address: string, tokenId: string): Promise<any> => {
  return createFetch(`assets/${address}/${tokenId}`);
};

export const getOrders = (query: Query): Promise<any> => {
  const inputQuery = {
    limit: 48,
    offset: 0,
    ...query
  };

  const url = `orders?${createSearchParams(inputQuery)}`;
  return createFetch(url);
};

export const getEvents = (query: Query): Promise<any> => {
  return createFetch(`events?${createSearchParams(query)}`);
};

export const getCollections = (query?: Query): Promise<any> => {
  return createFetch(`collections?${createSearchParams(query)}`);
};

export const getCollection = (slug: string): Promise<any> => {
  return createFetch(`collections/${slug}`);
};

export const getAssets = (query?: Query): Promise<any> => {
  return createFetch(`assets?${createSearchParams(query)}`);
};

export const getProfileByAddress = (address: string): Promise<User> => {
  return createFetch(`users/${address}`);
};

export const getAuction = (id: string): Promise<any> => {
  return createFetch(`auctions/${id}`);
};

export const getAuctionBids = (id: string): Promise<any> => {
  return createFetch(`auctions/${id}/bids`);
};

export const setProfileBanner = async (address: string, banner: any): Promise<any> => {
  const signature = await getMetamaskBackendToken(address);

  const formData = new FormData();
  formData.append('file', banner);
  const options = {
    method: 'POST',
    headers: new Headers({ signature, address }),
    body: formData
  };
  return createFetch(`users/${address}/banner`, options);
};

export const setProfileAvatar = async (address: string, avatar: any): Promise<any> => {
  const signature = await getMetamaskBackendToken(address);

  const formData = new FormData();
  formData.append('file', avatar);
  const options = {
    method: 'POST',
    headers: new Headers({ signature, address }),
    body: formData
  };
  return createFetch(`users/${address}/avatar`, options);
};

export const setProfileName = async (address: string, name: string): Promise<any> => {
  const signature = await getMetamaskBackendToken(address);

  const options = {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', signature, address }),
    body: JSON.stringify({ name })
  };
  return createFetch(`users/${address}/name`, options);
};

export const secureRequest = async (payload: any, address: string): Promise<any> => {
  const signature = await getMetamaskBackendToken(address);

  const data = {
    payload,
    address,
    signature
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  // create request. for example 'blockchains' guarded on back
  return createFetch('blockchains', options);
};

export const getTokenURLS = (creator: string, count: number): Promise<any> => {
  const inputQuery = {
    user: creator,
    quantity: count
  };

  const url = `unique-sets/items?${createSearchParams(inputQuery)}`;

  const tokenURL = createFetch(url);

  return tokenURL;
};

export const getAvailableCnt = (creator: string): Promise<any> => {
  const inputQuery = {
    user: creator
  };

  const url = `unique-sets/available?${createSearchParams(inputQuery)}`;

  const tokenURL = createFetch(url);

  return tokenURL;
};

interface IUpdateFavoritesResDto {
  count: number;
  favorites: string[];
}

export const updateFavorites = (
  assetId: string,
  userAddress: string
): Promise<IUpdateFavoritesResDto> => {
  const data = {
    assetId,
    userAddress
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return createFetch('assets/favorites', options);
};

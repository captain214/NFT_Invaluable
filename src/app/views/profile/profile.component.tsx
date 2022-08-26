import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { Avatar } from '../../components/avatar/avatar.component';
import { OfferCard } from '../../components/offer-card/offer-card.component';
import { ProfileInfo } from './components/profile-info/profile-info.component';
import { getAssets, getProfileByAddress } from '../../../api/api';
import { LoadingBackground } from '../../components/loading-background/loading-background.component';
import type { Asset } from '../../../types/asset';

import './profile.styles.scss';
import { LocalStorageKeys } from '../../../constants/local-storage-keys.enum';

const ORDER_PAGINATION_LIMIT = 15;

enum FilterType {
  FAVORITES,
  OWNED,
  FOR_SALE
}

export const Profile: FC = () => {
  const { address } = useParams<{
    address: string;
  }>();
  const { account } = useWeb3React();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>({});
  const [assets, setAssets] = useState<Asset[]>();
  const [filter, setFilter] = useState<FilterType>(FilterType.OWNED);
  const [hasEnded, setHasEnded] = useState(false);
  const [page, setPage] = useState<number>(0);
  const isOwner = useMemo(() => account === profile.address, [account, profile]);

  const fetchProfileAssetsPage = async (pageNum: number): Promise<any> => {
    const options: any = {
      page: pageNum,
      limit: ORDER_PAGINATION_LIMIT,
      on_auction: filter === FilterType.FOR_SALE,
      buy_now: filter === FilterType.FOR_SALE,
      owner: address || account || ''
    };
    if (filter === FilterType.FAVORITES) {
      options.favorites = profile.favorites;
      options.owner = '';
    }
    return getAssets(options);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const updateProfile = async () => {
    try {
      const response = await getProfileByAddress(address || account || '');
      setProfile(response);
      if (account && address?.toLowerCase() === account.toLowerCase()) {
        localStorage.setItem(LocalStorageKeys.AVATAR_URL, response.avatar);
      }
    } catch (e) {
      console.error('Can not fetch profile: ', e.message);
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIsLoading(true);
    updateProfile().then((result) => {
      if (result) setIsLoading(false);
    });
  }, [address, account]);

  useEffect(() => {
    if (!hasEnded) {
      fetchProfileAssetsPage(page)
        .then((response) => {
          const result = [...(assets || []), ...response.assets];
          setAssets(result);
          if (result.length >= response.count) {
            setHasEnded(true);
          }
        })
        .catch((e) => console.error('Can not fetch profile: ', e.message));
    }
  }, [page]);

  useEffect(() => {
    setAssets([]);
    setHasEnded(false);
    if (page === 0) {
      fetchProfileAssetsPage(0)
        .then((response) => {
          setAssets(response.assets);
          if (response.assets.length === response.count) {
            setHasEnded(true);
          }
        })
        .catch((e) => console.error('Can not fetch profile: ', e.message));
    } else {
      setPage(0);
    }
  }, [filter, address, account, profile]);

  const updateFavorites = async () => {
    if (filter === FilterType.FAVORITES) {
      await updateProfile();
    }
  };

  if (isLoading) return <LoadingBackground />;
  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <div className="profile-page__banner">
          {profile.banner && <img src={profile.banner} alt="Profile banner." />}
        </div>
        <div className="profile-page__full-info">
          <div className="profile-page__avatar-position">
            <div className="profile-page__avatar">
              <Avatar src={profile.avatar} hasBorder />
            </div>
          </div>
          <div className="profile-page__profile-info">
            <ProfileInfo profile={profile} onUpdate={updateProfile} />
          </div>
        </div>
      </header>
      <div className="profile-page__filter-tags">
        <button
          type="button"
          className={cn('profile-page__filter-tag', {
            'profile-page__filter-tag__active': filter === FilterType.OWNED
          })}
          onClick={() => setFilter(FilterType.OWNED)}
        >
          <div>Owned</div>
          {/* <div className="profile-page__count">32</div> */}
        </button>
        <button
          type="button"
          className={cn('profile-page__filter-tag', {
            'profile-page__filter-tag__active': filter === FilterType.FOR_SALE
          })}
          onClick={() => setFilter(FilterType.FOR_SALE)}
        >
          <div>For Sale</div>
        </button>
        {isOwner && (
          <button
            type="button"
            className={cn('profile-page__filter-tag', {
              'profile-page__filter-tag__active': filter === FilterType.FAVORITES
            })}
            onClick={() => setFilter(FilterType.FAVORITES)}
          >
            <div>Favorites</div>
          </button>
        )}
      </div>
      <div className="profile-page-card-board">
        {assets?.map((asset) => (
          <OfferCard
            asset={asset}
            key={asset.id}
            className="profile-page-offer-card"
            onUpdate={updateFavorites}
          />
        ))}
      </div>
      <div className="profile-load-btn">
        {!hasEnded && (
          <button type="button" className="marketplace-load-btn" onClick={loadMore}>
            LOAD MORE
          </button>
        )}
      </div>
    </div>
  );
};

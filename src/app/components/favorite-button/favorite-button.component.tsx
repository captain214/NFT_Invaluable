import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import './favorite-button.styles.css';
import favoriteIcon from '../../../assets/images/favorite-icon.svg';
import favoriteFilledIcon from '../../../assets/images/favorite-filled-icon.svg';
import { getProfileByAddress, updateFavorites } from '../../../api/api';
import { Asset } from '../../../types/asset';

interface IProps {
  asset: Asset;
  onUpdate?: () => unknown;
}

export const FavoriteButton: React.FC<IProps> = ({ asset, onUpdate }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { active, account } = useWeb3React();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [count, setCount] = useState<number>(asset.favorites_count);

  const getFavorites = async () => {
    if (account) {
      try {
        const user = await getProfileByAddress(account);
        setFavorites(user.favorites);
      } catch (e) {
        console.error('Can not fetch profile: ', e.message);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    getFavorites();
  }, [account]);

  useEffect(() => {
    if (favorites.includes(asset.id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favorites]);

  const handleFavorites = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (active && account) {
      const response = await updateFavorites(asset.id, account);
      setCount(response.count);
      setFavorites(response.favorites);
      if (onUpdate) {
        await onUpdate();
      }
    } else {
      // TODO: show some message to user.  like "available to users, login please"
    }
  };

  return (
    <button type="button" onClick={handleFavorites} className="favorite-btn">
      <img
        src={isFavorite ? favoriteFilledIcon : favoriteIcon}
        className="favorite-icon"
        alt="favorite icon"
      />
      <span className="favorites-count">{count ?? 0}</span>
    </button>
  );
};

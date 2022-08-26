import { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import cn from 'classnames';
import { useWeb3React } from '@web3-react/core';
import { ReactComponent as VerifiedNameIcon } from './assets/images/verified-name.icon.svg';
import { setProfileAvatar, setProfileBanner, setProfileName } from '../../../../../api/api';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

import './assets/styles/profile-info.styles.scss';

interface ProfileInfoProps {
  profile: any;
  onUpdate?: () => unknown;
}

export const ProfileInfo: FC<
  ProfileInfoProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
  const { profile, onUpdate } = props;
  const isProfileVerified = profile.isVerified;
  const [isEditProfileMenuVisible, setIsEditProfileMenuVisible] = useState(false);
  const refToEditMenuButton = useClickOutside(() => setIsEditProfileMenuVisible(false));
  const [userName, setUserName] = useState('');
  const { account } = useWeb3React();

  const clickEditProfileMenu = () => {
    setIsEditProfileMenuVisible((prev) => !prev);
  };

  const updateProfileData = async () => {
    if (onUpdate) {
      await onUpdate();
    }
  };

  const bannerInputHandler = async (event: any) => {
    if (!account) {
      return;
    }
    try {
      await setProfileBanner(account, event.target.files[0]);
      await updateProfileData();
    } catch (e) {
      console.error(e.message);
    }
    clickEditProfileMenu();
  };

  const avatarInputHandler = async (event: any) => {
    if (!account) {
      return;
    }
    try {
      await setProfileAvatar(account, event.target.files[0]);
      await updateProfileData();
    } catch (e) {
      console.error(e.message);
    }
    clickEditProfileMenu();
  };

  const nameInputHandler = async (event: any) => {
    if (!account) {
      return;
    }
    if (event.key === 'Enter') {
      try {
        await setProfileName(account, userName);
      } catch (e) {
        console.error(e.message);
      }
      setUserName('');
      clickEditProfileMenu();
      await updateProfileData();
    }
  };

  const accountEllipsis = (address: string) =>
    address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : null;

  return (
    <div className="profile-info">
      <section className="profile-info__name-section">
        <h2 className="profile-info__name">{profile.name?.toUpperCase() || 'UNNAMED'}</h2>
        {isProfileVerified ? (
          <div className="profile-info__verified-name-icon">
            <VerifiedNameIcon />
          </div>
        ) : null}
        {account?.toLowerCase() === profile.address?.toLowerCase() && (
          <div className="profile-info__edit-profile-button-container" ref={refToEditMenuButton}>
            <button
              type="button"
              className={cn('profile-info__edit-profile-button', {
                'profile-info__edit-profile-button-menu__visible': isEditProfileMenuVisible
              })}
              onClick={clickEditProfileMenu}
            >
              edit profile
            </button>
            <div
              className="profile-info__edit-profile-menu edit-profile-menu"
              style={isEditProfileMenuVisible ? { display: 'block' } : { display: 'none' }}
            >
              <input
                accept="image/*"
                type="file"
                className="profile-info__edit-profile-menu-cover edit-profile-menu__input"
                onChange={bannerInputHandler}
              />
              <input
                accept="image/*"
                type="file"
                className="profile-info__edit-profile-menu-profile-pic edit-profile-menu__input"
                onChange={avatarInputHandler}
              />
              <input
                type="text"
                placeholder="Username"
                className="profile-info__edit-profile-menu-username-input edit-profile-menu__input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={nameInputHandler}
              />
            </div>
          </div>
        )}
      </section>
      <section className="profile-info__wallet-section">
        <div className="profile-info__wallet-address">{accountEllipsis(profile.address)}</div>
      </section>
      <p className="profile-info__description">{profile.about}</p>
    </div>
  );
};

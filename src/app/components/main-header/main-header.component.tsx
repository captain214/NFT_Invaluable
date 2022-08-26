import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import classnames from 'classnames';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useMetamaskConnect } from '../../../hooks/useMetamaskConnect';
import { metaMaskProvider } from '../../../utils/wallet';
import { Routes } from '../../constants';
import logoIconPath from './assets/images/logo.icon.png';
import hamburgerIcon from './assets/images/hamburger-icon.png';
import closeIcon from './assets/images/close-icon.png';
import { useMarketplaceFilter } from '../../views/marketplace/components/MarketplaceFilterProvider/marketplace-filter-context';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { FilterType } from '../../views/marketplace/marketplace.interfaces';
import { Avatar } from '../avatar/avatar.component';
import { SearchBox } from './components/search-box/search-box.component';
import type { User } from '../../../types/user';
import { getProfileByAddress } from '../../../api/api';

import './assets/styles/main-header.styles.scss';
import { LocalStorageKeys } from '../../../constants/local-storage-keys.enum';

export const MainHeader: FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = (
  props
) => {
  const { ...detailedHTMLProps } = props;

  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [isMenuOverlay, setIsMenuOverlay] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const menuRef = useClickOutside(() => setMenuVisibility(false));

  const [searchInputValue, setSearchInputValue] = useState('');
  const history = useHistory();
  const filter = useMarketplaceFilter();

  const searchInput = useRef<HTMLInputElement>(null);

  const { active, account } = useWeb3React();
  const { connect, disconnect } = useMetamaskConnect();

  const isMetaMaskDetected = useRef<boolean>();
  const isMetaMaskLocked = useRef<boolean>();

  useEffect(() => {
    (async () => {
      const [IS_METAMASK_DETECTED, IS_METAMASK_LOCKED] = await Promise.all([
        metaMaskProvider.checkIfDetected(),
        metaMaskProvider.checkIfLocked()
      ]);

      isMetaMaskDetected.current = IS_METAMASK_DETECTED;
      isMetaMaskLocked.current = IS_METAMASK_LOCKED;
    })();
  }, []);

  const defaultName = 'unnamed';

  const [user, setUser] = useState<User>();
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    setInterval(() => {
      const avatarUrlFromLocalStorage = localStorage.getItem(LocalStorageKeys.AVATAR_URL);
      if (avatarUrlFromLocalStorage === null) return;

      setAvatarUrl(avatarUrlFromLocalStorage);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!account) return;

    (async () => {
      try {
        const userData = (await getProfileByAddress(account)) as User;
        setUser(userData);
      } catch (error) {
        console.error(`Can not fetch user data in ${MainHeader.name} component:`, error);
      }
    })();
  }, [account]);

  const setSearchFilter = () => {
    if (searchInputValue.length > 2) {
      filter.add({
        id: 'search',
        title: searchInputValue,
        type: FilterType.SEARCH,
        value: searchInputValue
      });

      history.push('/marketplace');
    }
  };

  function onResizeFunction() {
    setDeviceWidth(window.innerWidth);
  }

  window.addEventListener('resize', onResizeFunction);
  window.addEventListener('load', onResizeFunction);

  const searchKeyDownHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      setSearchFilter();
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
    if (!e.target.value) {
      filter.remove('search');
    }
  };

  useEffect(() => {
    const searchFilter = filter.state.find((item) => item.type === FilterType.SEARCH);
    if (!searchFilter) {
      setSearchInputValue('');
    }
  }, [filter]);

  return (
    <header
      {...detailedHTMLProps}
      className={classnames(detailedHTMLProps.className, 'main-header')}
    >
      <nav className="main-header__nav">
        <Link to={Routes.HOME}>
          <img src={logoIconPath} className="main-header__logo" alt="Logo" />
        </Link>

        <div className="main-header__search-box-position">
          <div className="main-header__search-box">
            <SearchBox
              ref={searchInput}
              value={searchInputValue}
              placeholder="Search by Items, Collect..."
              onChange={onChangeHandler}
              onKeyDown={(e) => searchKeyDownHandler(e)}
              onButtonClick={setSearchFilter}
            />
          </div>
        </div>
        <div className="hamburger">
          <Avatar
            className="menu-icon hamburger-icon"
            src={!isMenuOverlay ? hamburgerIcon : closeIcon}
            onClick={() => setIsMenuOverlay(!isMenuOverlay)}
          />
        </div>
        {(isMenuOverlay || deviceWidth > 767) && (
          <div className="menu-block d-flex">
            <ul className="main-header__nav-list">
              <li className="main-header__nav-item">
                <NavLink className="main-header__nav-link" to={Routes.MINTING_DROP} exact>
                  Drops
                </NavLink>
                <NavLink className="main-header__nav-link" to={Routes.MARKETPLACE} exact>
                  marketplace
                </NavLink>
              </li>
              <li className="main-header__nav-item loginBtn">
                {active ? (
                  <div className="main-header__menu" ref={menuRef} aria-hidden={isMenuVisible}>
                    <div className="menu__avatar">
                      <Avatar
                        hasGlow
                        src={avatarUrl || user?.avatar}
                        onClick={() => setMenuVisibility(!isMenuVisible)}
                      />
                    </div>

                    <nav
                      className="menu__nav-bar"
                      style={isMenuVisible ? { display: 'block' } : { display: 'none' }}
                    >
                      <div className="menu__user-info">
                        <div className="menu__username">{user?.name || defaultName}</div>
                      </div>

                      <div className="menu__separate-border" aria-hidden />

                      <ul className="menu__nav-list">
                        <li className="menu__nav-list-item">
                          <Link className="menu__nav-list-item-link" to="/profile">
                            Profile
                          </Link>
                        </li>
                        <li className="menu__nav-list-item">
                          <button
                            className="menu__log-out-button"
                            type="button"
                            onClick={() => {
                              const path = account ? `/users/${account}` : '#';
                              disconnect();
                              history.push(path);
                            }}
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                ) : (
                  <>
                    <button
                      className="main-header__login-button"
                      type="button"
                      aria-hidden={isMenuVisible}
                      onClick={() => {
                        if (isMetaMaskDetected.current === false) {
                          // TODO: replace on some popup of notification component
                          alert('🔴 Metamask is not installed!');

                          return;
                        }

                        connect();
                      }}
                    >
                      Log in / Sign up
                    </button>
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

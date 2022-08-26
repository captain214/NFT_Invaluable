import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './item-details.styles.scss';

import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { Collapsible } from '../../components/collapsible/collapsible.component';
import { ItemInfo } from './components/item-info/item-info.component';
import { ItemPreview } from './components/item-preview/item-preview.component';
import { ItemPrice } from './components/item-price/item-price.component';
import { ItemListings } from './components/item-listings/item-listings.component';
import { ItemTradingHistory } from './components/item-trading-history/item-trading-history.component';
import {
  EPriceHistoryFilter,
  ItemPriceHistory
} from './components/item-price-history/item-price-history.component';

import { ReactComponent as BoardIcon } from '../../../assets/images/board-icon.svg';
import { OfferCard } from '../../components/offer-card/offer-card.component';
import { DAY } from '../../../utils/time-utils';
import { getAssets, getEvents, getOrders, getSingleAsset } from '../../../api/api';
import { ModalList } from '../../components/modals/modal-list/modal-list.component';
import { ModalBuy } from '../../components/modals/modal-buy/modal-buy.component';
import { Order } from '../../types/api/Order';
import { ModalCancel } from '../../components/modals/modal-cancel/modal-cancel.component';
import { formatAddress } from '../../../utils/eth-utils';
import { Chain, chainIds, chainTitles, getAddressLink } from '../../../constants/chains';
import { LoadingBackground } from '../../components/loading-background/loading-background.component';
import priceIcon from '../../../assets/images/price-icon.png';

enum CommonGroup {
  DESCRIPTION,
  PROPERTIES,
  ABOUT,
  DETAILS
}

enum TradingGroup {
  PRICE_HISTORY,
  ORDERS,
  TRADING_HISTORY
}

export const ItemDetails: FC = () => {
  const { address, tokenId } = useParams<{
    address: string;
    tokenId: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [asset, setAsset] = useState<any>();
  const [assetsMore, setAssetsMore] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [saleEvents, setSaleEvents] = useState<any[]>([]);
  const [isTxRunning, setIsTxRunning] = useState(false);
  const [commonGroup, setCommonGroup] = useState(CommonGroup.DESCRIPTION);
  const [tradingGroup, setTradingGroup] = useState(TradingGroup.ORDERS);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  const cancelOrderRef = useRef<Order>();
  const buyOrderRef = useRef<Order>();

  const { chainId, account } = useWeb3React();

  const init = async () => {
    const [assetResponse, eventsResponse, ordersResponse] = await Promise.all([
      getSingleAsset(address, tokenId),
      getEvents({ address, token_id: tokenId }),
      getOrders({ address, token_id: tokenId })
    ]);
    setAsset(assetResponse);
    setEvents(eventsResponse);
    setSaleEvents(eventsResponse);
    setOrders(ordersResponse);
    setIsLoading(false);

    try {
      const assetsMoreResponse = await getAssets({
        collection_slug: assetResponse.collection?.slug,
        limit: 5
      });
      setAssetsMore(assetsMoreResponse.assets.filter((i: any) => i.id !== assetResponse.id));
    } catch (e) {
      console.error('Can not fetch assets from collection: ', e.message);
    }
  };

  const properties: Record<string, string | number>[] | null = useMemo(() => {
    try {
      return JSON.parse(asset.properties);
    } catch (e) {
      return null;
    }
  }, [asset]);

  const isUserOnCorrectChain = () => {
    return chainIds[asset.chain_id as Chain] === chainId;
  };
  const handleList = () => {
    if (!isUserOnCorrectChain()) {
      alert('You are on the wrong chain!');
      return;
    }
    setIsListModalOpen(true);
  };
  const handleBuy = (order?: Order) => {
    if (!isUserOnCorrectChain()) {
      alert('You are on the wrong chain!');
      return;
    }
    if (order) buyOrderRef.current = order;
    setIsBuyModalOpen(true);
  };
  const handleCancel = (order?: Order) => {
    if (!isUserOnCorrectChain()) {
      alert('You are on the wrong chain!');
      return;
    }
    if (order) cancelOrderRef.current = order;
    setIsCancelModalOpen(true);
  };

  const handleListModalClose = () => setIsListModalOpen(false);
  const handleBuyModalClose = () => {
    buyOrderRef.current = undefined;
    setIsBuyModalOpen(false);
  };
  const handleCancelModalClose = () => {
    cancelOrderRef.current = undefined;
    setIsCancelModalOpen(false);
  };

  const handleModalTxStart = async (tx: any) => {
    setIsTxRunning(true);
    await tx.wait();
    await init();
    setIsTxRunning(false);
  };

  useEffect(() => {
    setIsLoading(true);
    init();
  }, [address, tokenId]);

  const handlePriceHistoryFilterChange = async (value: EPriceHistoryFilter) => {
    const occurredAfter = value ? Date.now() - DAY * value : undefined;
    const eventsResponse = await getEvents({
      address,
      token_id: tokenId,
      occurred_after: occurredAfter && new Date(occurredAfter).toISOString(),
      type: 'TRANSFER'
    });
    setSaleEvents(eventsResponse);
  };

  const handleCommonGroupChange = (group: CommonGroup) => () => {
    setCommonGroup(group);
  };

  const handleTradingGroupChange = (group: TradingGroup) => () => {
    setTradingGroup(group);
  };

  const sellOrders = orders.filter((i: any) => i.side === 'SELL' && i.status === 'ACTIVE');

  function onResizeFunction() {
    setDeviceWidth(window.innerWidth);
  }

  window.addEventListener('resize', onResizeFunction);
  window.addEventListener('load', onResizeFunction);

  if (isLoading) return <LoadingBackground />;

  return (
    <div className="item-details-container">
      <div className="item-details-root">
        <div className="main-block">
          <div className="main-block__left-col">
            <ItemPreview
              imageUrl={asset.image_url}
              mediaUrl={asset.animation_url}
              type={asset.role}
              className="item-preview"
            />
          </div>
          <div className="main-block__right-col">
            <ItemInfo className="item-info" asset={asset} />

            {deviceWidth < 767 && (
              <div className="floating-price">
                <div className="item-price item-price">
                  <div className="item-price__info">
                    <p className="item-price__title">Highest Offer</p>
                    <p className="item-price__value">
                      0.01 ETH <img src={priceIcon} className="price-icon" alt="price icon" />
                    </p>
                  </div>
                  <button
                    type="button"
                    className="gradient-button-root gradient-button-root gradient-button-root--normal item-price__btn"
                  >
                    MAKE AN OFFER
                  </button>
                </div>
                <div className="divider">Divider</div>
                <div className="item-price item-price">
                  <div className="item-price__info">
                    <p className="item-price__title">Buy Now</p>
                    <p className="item-price__value">
                      0.01 ETH <img src={priceIcon} className="price-icon" alt="price icon" />
                    </p>
                  </div>
                  <button
                    type="button"
                    className="gradient-button-root gradient-button-root--filled gradient-button-root--normal item-price__btn"
                  >
                    Buy now
                  </button>
                </div>
              </div>
            )}
            <ItemPrice
              balances={asset?.balances}
              orders={sellOrders}
              account={account}
              loading={isTxRunning}
              className="item-price"
              handleBuy={handleBuy}
              handleList={handleList}
              handleUnlist={handleCancel}
            />
            <div className="item-common-group">
              <div className="item-common-group__btn-list">
                <button
                  className={cn(
                    'item-common-group__btn',
                    commonGroup === CommonGroup.DESCRIPTION && 'item-common-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleCommonGroupChange(CommonGroup.DESCRIPTION)}
                >
                  Description
                </button>
                {properties && (
                  <button
                    className={cn(
                      'item-common-group__btn',
                      commonGroup === CommonGroup.PROPERTIES && 'item-common-group__btn--selected'
                    )}
                    type="button"
                    onClick={handleCommonGroupChange(CommonGroup.PROPERTIES)}
                  >
                    Properties
                  </button>
                )}
                <button
                  className={cn(
                    'item-common-group__btn',
                    commonGroup === CommonGroup.ABOUT && 'item-common-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleCommonGroupChange(CommonGroup.ABOUT)}
                >
                  About
                </button>
                <button
                  className={cn(
                    'item-common-group__btn',
                    commonGroup === CommonGroup.DETAILS && 'item-common-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleCommonGroupChange(CommonGroup.DETAILS)}
                >
                  Details
                </button>
              </div>
              {commonGroup === CommonGroup.DESCRIPTION && (
                <div className="item-description-content">{asset.description}</div>
              )}
              {commonGroup === CommonGroup.PROPERTIES && (
                <div className="property-container">
                  {properties?.map((i) => (
                    <div className="property" key={String(i.trait_type) + i.value + i.display_type}>
                      <div className="property__content">
                        <p className="property__title">{i.trait_type}</p>
                        <p className="property__value">{i.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {commonGroup === CommonGroup.ABOUT && (
                <div className="item-about-content">
                  {asset.creator?.avatar && (
                    <img
                      className="item-about-content__avatar"
                      src={asset.creator?.avatar}
                      alt="author"
                    />
                  )}
                  <span>
                    <span>Created by </span>
                    <Link className="streak-link" to="#Rob">
                      {asset.creator?.name || formatAddress(asset.creator?.address)}
                    </Link>
                  </span>
                </div>
              )}
              {commonGroup === CommonGroup.DETAILS && (
                <div className="item-asset-details-content">
                  <div className="item-asset-details-content__row">
                    <span>Contract Address</span>
                    <a
                      className="streak-link"
                      target="_blank"
                      rel="noreferrer"
                      href={getAddressLink(asset.chain_id, asset.address)}
                    >
                      {formatAddress(asset.address)}
                    </a>
                  </div>
                  <div className="item-asset-details-content__row">
                    <span>Token ID</span>
                    <span>{asset.token_id}</span>
                  </div>
                  <div className="item-asset-details-content__row">
                    <span>Token Standard</span>
                    <span>{asset.type}</span>
                  </div>
                  <div className="item-asset-details-content__row">
                    <span>Blockchain</span>
                    <span>{chainTitles[asset.chain_id as Chain]}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="item-trading-group">
              <div className="item-trading-group__btn-list">
                <button
                  className={cn(
                    'item-trading-group__btn',
                    tradingGroup === TradingGroup.ORDERS && 'item-trading-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleTradingGroupChange(TradingGroup.ORDERS)}
                >
                  Orders
                </button>
                <button
                  className={cn(
                    'item-trading-group__btn',
                    tradingGroup === TradingGroup.PRICE_HISTORY &&
                      'item-trading-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleTradingGroupChange(TradingGroup.PRICE_HISTORY)}
                >
                  Price History
                </button>
                <button
                  className={cn(
                    'item-trading-group__btn',
                    tradingGroup === TradingGroup.TRADING_HISTORY &&
                      'item-trading-group__btn--selected'
                  )}
                  type="button"
                  onClick={handleTradingGroupChange(TradingGroup.TRADING_HISTORY)}
                >
                  Trading History
                </button>
              </div>
              {tradingGroup === TradingGroup.PRICE_HISTORY && (
                <ItemPriceHistory
                  events={saleEvents}
                  onFilterChange={handlePriceHistoryFilterChange}
                />
              )}
              {tradingGroup === TradingGroup.ORDERS && (
                <>
                  {/* <ItemOfferings className="item-offerings" orders={buyOrders} /> */}
                  <ItemListings
                    className="item-trading-group__listings"
                    orders={sellOrders}
                    type={asset.type}
                    loading={isTxRunning}
                    handleBuy={handleBuy}
                    handleUnlist={handleCancel}
                  />
                </>
              )}
              {tradingGroup === TradingGroup.TRADING_HISTORY && (
                <ItemTradingHistory events={events} type={asset.type} />
              )}
            </div>
          </div>
        </div>
        {asset.collection && (
          <Collapsible
            icon={<BoardIcon fill="#FE2572" />}
            title="More from this collection"
            theme="dark"
          >
            <div className="item-more-cards">
              {assetsMore.map((i) => (
                <OfferCard
                  className="more-offer-card"
                  asset={i}
                  key={i.id}
                  theme="dark"
                  width="312px"
                />
              ))}
            </div>
            <div className="item-more-footer">
              <Link
                to={`/collection/${asset.collection.slug}`}
                className="item-more-btn btn btn-primary"
              >
                View Collection
              </Link>
            </div>
          </Collapsible>
        )}
      </div>
      <ModalList
        asset={asset}
        orders={orders}
        isOpen={isListModalOpen}
        onRequestClose={handleListModalClose}
        onTxStart={handleModalTxStart}
      />
      <ModalBuy
        asset={asset}
        orders={sellOrders}
        targetOrder={buyOrderRef.current}
        isOpen={isBuyModalOpen}
        onRequestClose={handleBuyModalClose}
        onTxStart={handleModalTxStart}
      />
      <ModalCancel
        orders={sellOrders}
        targetOrder={cancelOrderRef.current}
        isOpen={isCancelModalOpen}
        onRequestClose={handleCancelModalClose}
        onTxStart={handleModalTxStart}
      />
    </div>
  );
};

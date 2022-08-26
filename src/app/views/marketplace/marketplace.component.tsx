import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import { OfferCard } from '../../components/offer-card/offer-card.component';

import './marketplace.styles.css';
import { useMarketplaceFilter } from './components/MarketplaceFilterProvider/marketplace-filter-context';
import { FilterType } from './marketplace.interfaces';
import { getAssets } from '../../../api/api';

import { MarketplaceFilter } from './components/MarketplaceFilter/marketplace-filter.component';
import { LoadingBackground } from '../../components/loading-background/loading-background.component';
import player1Icon from '../main/images/player1.png';
import playerFullImg from '../main/images/playerFull.png';
import strokes from '../main/images/strokes.svg';

const ORDER_PAGINATION_LIMIT = 15;

export const Marketplace: FC = () => {
  const [isInit, setIsInit] = useState(false);
  const [assets, setAssets] = useState<any[]>();
  const [page, setPage] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  const filter = useMarketplaceFilter();

  const fetchPage = async (pageNum: number): Promise<any> => {
    console.log('filter', filter.state);
    const onAuction = filter.state.some((i) => i.type === FilterType.ON_AUCTION);
    const newAssets = filter.state.some((i) => i.type === FilterType.NEW);
    const buyNow = filter.state.some((i) => i.type === FilterType.BUY_NOW);
    const search = filter.state.find((i) => i.type === FilterType.SEARCH);

    let order = {};
    if (filter.state.some((i) => i.type === FilterType.HIGHEST_PRICE)) {
      order = { by: 'current_price', direction: 'DESC' };
    }
    if (filter.state.some((i) => i.type === FilterType.FLOOR_PRICE)) {
      order = { by: 'current_price', direction: 'ASC' };
    }
    return getAssets({
      page: pageNum,
      limit: ORDER_PAGINATION_LIMIT,
      on_auction: onAuction,
      new: newAssets,
      buy_now: buyNow,
      search: search?.value,
      ...order
    });
  };

  useEffect(() => {
    setAssets([]);
    setHasEnded(false);
    if (page === 0) {
      fetchPage(0)
        .then((response) => {
          setAssets(response.assets);
          setIsInit(true);
          if (response.assets.length === response.count) {
            setHasEnded(true);
          }
        })
        .catch((e) => console.error('Can not fetch marketplace page: ', e.message));
    } else {
      setPage(0);
    }
  }, [filter]);

  const loadMore = () => {
    setPage(page + 1);
    fetchPage(page + 1)
      .then((response) => {
        const result = [...(assets || []), ...response.assets];
        setAssets(result);
        if (result.length >= response.count) {
          setHasEnded(true);
        }
      })
      .catch((e) => console.error('Can not fetch marketplace page: ', e.message));
  };

  if (!isInit) return <LoadingBackground />;
  return (
    <>
      <div className="black-bg">
        <div className="marketplace-container">
          <div className="tall-block gradient-blue-bg b-r-20">
            <div className="row wrapper">
              <div className="col-lg-3 img-block">
                <img className="player1-img w-100" src={player1Icon} alt="Tick Icon" />
                <img className="player-full-img w-100" src={playerFullImg} alt="Tick Icon" />
              </div>
              <div className="col-lg-5 content-block">
                <div className="small-heading gradient-pink-c-1 ff-m-bold">
                  INVALUABLE SIGNATURE DROP
                </div>
                <div className="big-heading white-c ff-m-bold">“TOO TALL”</div>
                <div className="body-4 white-c">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ornare
                  mauris. Donec nec sem enim.
                </div>
              </div>
              <div className="col-md-4 btn-block">
                <div className="btn-wrapper">
                  <Link to={Routes.MINTING_DROP}>
                    <button
                      className="cta blackBtn m-0"
                      type="button"
                      data-toggle="modal"
                      data-target="#exampleModal"
                    >
                      DROPPING <span className="gradient-pink-c">OCT 15</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="floating-lines">
              <img src={strokes} alt="Stroke lines" />
            </div>
          </div>
          <MarketplaceFilter />

          <div className="marketplace-card-board">
            {assets?.map((asset: any) => (
              <OfferCard asset={asset} key={asset.id} className="marketplace-offer-card" />
            ))}
          </div>
          <div>
            {!hasEnded && (
              <button type="button" className="marketplace-load-btn" onClick={loadMore}>
                LOAD MORE
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

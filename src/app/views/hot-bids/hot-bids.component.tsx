import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import './hot-bids.styles.scss';

import { format, intervalToDuration } from 'date-fns';
import { useWeb3React } from '@web3-react/core';
import { parseEther } from '@ethersproject/units';
import background1 from './images/background1.png';
import background2 from './images/background2.png';
import streakStar from '../../../assets/images/streak-star.svg';
import avatar from '../../../assets/images/avatar-placeholder.png';
import priceIcon from '../../../assets/images/price-icon.png';

import { TwitchWrapper } from './components/twitch-wrapper/twitch-wrapper.component';
import { Table } from '../../components/table/table.component';
import { HighestBid } from './components/highest-bid/highest-bid.component';
import { DropCard } from './components/drop-card/drop-card.component';
import { getAuction, getAuctionBids } from '../../../api/api';
import { SECOND } from '../../../utils/time-utils';
import { useAuctionFactoryStreak } from '../../../hooks/useContract';
import { normalizeEthPrice } from '../../../utils/eth-utils';
import useStateRef from '../../../hooks/useStateRef';
import { Chain, chainIds, getTransactionLink } from '../../../constants/chains';

const AUCTION_ID = 'bb9b126d-707b-44f2-a4cf-7d9136604e68';
const UPDATE_INTERVAL = 15 * SECOND;

export const HotBids: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState<any>();
  const [bids, setBids] = useState<any[]>();
  const [bidsCount, setBidsCount] = useState<number>();
  const [countdown, setCountdown, countdownRef] = useStateRef(0);
  const { chainId, account } = useWeb3React();
  const auctionFactoryStreak = useAuctionFactoryStreak(auction?.chain_id);

  useEffect(() => {
    const updateBids = async () => {
      const bidsResp = await getAuctionBids(AUCTION_ID);
      setBids(bidsResp.bids);
      setBidsCount(bidsResp.count);
    };
    const intervalId = setInterval(updateBids, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    (async () => {
      const [auctionResp, bidsResp] = await Promise.all([
        getAuction(AUCTION_ID),
        getAuctionBids(AUCTION_ID)
      ]);
      setAuction(auctionResp);
      setBids(bidsResp.bids);
      setBidsCount(bidsResp.count);
      setCountdown(new Date(auctionResp.end_date).getTime() - Date.now());
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdownRef.current <= 0) clearInterval(intervalId);
      countdownRef.current += -1000;
      setCountdown(countdownRef.current);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBidClick = async () => {
    const auctionChainIdNumber = chainIds[auction.chain_id as Chain];
    if (chainId !== auctionChainIdNumber) {
      alert(`Your chain_id (${chainId}) doesn't match auction chain_id (${auctionChainIdNumber})!`);
      return;
    }
    const value = prompt('How much?');
    const tx = await auctionFactoryStreak?.placeBid(auction.address, {
      from: account,
      gasLimit: '10000000',
      value: parseEther(value || '0').toString()
    });
    console.log(getTransactionLink(auction.chain_id, tx.hash));
    await tx.wait();
    const bidsResp = await getAuctionBids(AUCTION_ID);
    setBids(bidsResp.bids);
    setBidsCount(bidsResp.count);
  };

  const highestBid = bids?.find(Boolean);
  const countdownParsed = (): string => {
    const { hours, minutes, seconds, days } = intervalToDuration({ start: 0, end: countdown });
    if (days && days > 1) return `${days} days`;
    const toTwoDigit = (value?: number): string => {
      if (value === undefined) return '';
      const strValue = String(value);
      return strValue.length === 1 ? `0${strValue}` : strValue;
    };
    return `${toTwoDigit(hours)}:${toTwoDigit(minutes)}:${toTwoDigit(seconds)}`;
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className={cn('hot-bids-page-root')}>
      <section className="stream-section" style={{ backgroundImage: `url(${background1})` }}>
        <div className="stream-section__wrapper">
          <div className="stream-section__header">
            <div className="title">
              <h1 className="title__text">Invaluable Limited Drop</h1>
              <h2 className="title__subtext">“{auction?.asset?.title}”</h2>
            </div>
            <div className="countdown">
              <p className="countdown__text">Limited drop ends in</p>
              <div className="countdown__time">{countdownParsed()}</div>
            </div>
          </div>
          <TwitchWrapper className="stream-twitch" />
          <div className="stream-section__footer">
            <HighestBid className="highest-bid" count={bidsCount} bid={highestBid} />
            <button type="button" className="btn btn-primary bid-btn" onClick={handleBidClick}>
              Bid now!
            </button>
          </div>
        </div>
      </section>

      <section className="auction-section">
        <div
          className="auction-section__preview"
          style={{ backgroundImage: `url(${background2})` }}
        >
          <DropCard
            className="drop-card"
            creator={auction?.asset?.creator}
            title={auction?.asset?.title}
            minBid={auction.starting_bid}
            maxBid={highestBid?.price}
            imageUrl={auction?.asset?.image_url}
          />
          <button type="button" className="btn btn-primary" onClick={handleBidClick}>
            BID NOW
          </button>
        </div>
        <div className="auction-section__bids">
          {!!highestBid && <HighestBid count={bidsCount} bid={highestBid} />}
          <Table className="bids-table">
            <Table.Row isHeader>
              <Table.Cell className="bids-table__header">Item</Table.Cell>
              <Table.Cell className="bids-table__header">Bid</Table.Cell>
              <Table.Cell className="bids-table__header">Buyer</Table.Cell>
              <Table.Cell className="bids-table__header">Date/Time</Table.Cell>
            </Table.Row>
            {bids?.map((i) => (
              <Table.Row className="bids-table__row" key={i.id}>
                <Table.Cell className="bids-table__cell">{auction?.asset?.title}</Table.Cell>
                <Table.Cell className="bids-table__cell">
                  <div className="bids-table__price">
                    <span>{normalizeEthPrice(i.price)}</span>
                    <img src={priceIcon} className="bids-table__price-icon" alt="price icon" />
                  </div>
                </Table.Cell>
                <Table.Cell className="bids-table__cell bids-table__cell-from">
                  {i.from_account}
                </Table.Cell>
                <Table.Cell className="bids-table__cell">
                  {format(new Date(i.created_at), 'MMM M, d p')}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </div>
      </section>

      <section className="more-section">
        <div className="history" style={{ backgroundImage: `url(${streakStar})` }}>
          <div className="history__image" style={{ backgroundImage: `url(${avatar})` }} />
          <p className="history__text">
            Ed “Too Tall” Jones was named All-Pro three times (1981, 1982, 1983) and went to three
            Pro Bowls in the final 10 seasons of his career, He would never miss a game, finishing
            with a team-record 244 games (including 20 playoffs) and 223 starts.
          </p>
        </div>
        <div className="drop-card-wrapper">
          <DropCard
            title="“Too Tall” AR Sculpture #287"
            creator="EdJones"
            imageUrl={avatar}
            price="390000000000000000"
          />
          <button type="button" className="btn btn-primary">
            BUY NOW
          </button>
        </div>
        <div className="drop-card-wrapper">
          <DropCard
            title="“Too Tall” Classic Card #65"
            creator="EdJones"
            imageUrl={avatar}
            price="1620000000000000000"
          />
          <button type="button" className="btn btn-primary">
            BUY NOW
          </button>
        </div>
      </section>
    </div>
  );
};

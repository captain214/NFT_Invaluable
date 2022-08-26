import '../minting-drop.styles.scss';
import background from '../images/background.jpg';

import { HighestBid } from './highest-bid/highest-bid.component';
import { TwitchWrapper } from './twitch-wrapper/twitch-wrapper.component';

const StreamSection = (props: any) => {
  return (
    <section className="stream-section" style={{ backgroundImage: `url(${background})` }}>
      <div className="stream-section__wrapper">
        <div className="stream-section__header">
          <div className="title">
            <h1 className="title__text">Invaluable Signature Drop</h1>
            <h2 className="title__subtext">GENESIS</h2>
          </div>
          <div className="countdown">
            <p className="countdown__text">Limited drop ends in</p>
            <p className="countdown__time">01:23:59</p>
          </div>
        </div>
        <div className="stream-section__content">
          <TwitchWrapper className="stream-section__twitch-wrapper" />
        </div>
        <div className="stream-section__footer">
          <HighestBid className="highest-bid" />
          <button type="button" className="bid-btn" onClick={props.toggleCheckOutModal}>
            MINT YOURS NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default StreamSection;

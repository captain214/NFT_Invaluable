import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';
// @ts-ignore
import DiamondVideoMp4 from './videos/diamond-custom.mp4';

import diamondIcon from './images/diamond-icon.png';
import iBigImg from './images/i_big_img.png';
import tickIcon from './images/tick.png';
import player1Icon from './images/player1.png';
import playerFullImg from './images/playerFull.png';

import vrBanner from './images/vr-banner.png';
import vrBannerMobile from './images/vr-banner-mobile.png';
import joinTextImg from './images/join-text.png';

import strokes from './images/strokes.svg';

import './main.styles.css';
import globalImg from './images/global-img.png';
import johnImg from './images/john-img.png';
import milkImg from './images/milk-img.png';
import shooterImg from './images/shooter-img.png';

const IMAGE_SIZE = 310;

export const Main: FC = () => {
  const history = useHistory();
  const navigateToMintDrop = () => {
    history.push('/minting-drop');
  };
  return (
    <>
      <div className="nft black-bg">
        <div className="main-container">
          <div id="hero-btn-wrapper" className="hero-btn-wrapper">
            <button
              className="cta purpleBtn box-shadow-blue text-uppercase"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              <div className="ff-m-md">INVALUABLE GENESIS SIGNATURE DROP</div>
              <div className="ff-m-reg">LIVE ON OCT 1st, 08:00PM EST. JOIN!</div>
            </button>
          </div>
          <div className="hero-block p-r container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-7 left">
                <div id="diamond-video-block" className="img-block m-b-2">
                  <video className="diamond-video" autoPlay loop muted playsInline>
                    <source src={DiamondVideoMp4} type="video/mp4" />
                    Your browser does not support HTML video.
                  </video>
                </div>
                <div className="content-block">
                  <div className="main-heading white-c m-b-2 ff-m-md f-w-700 text-uppercase">
                    <div className="white-c ff-z text-uppercase">We Are</div>
                    <div className="gradient-pink-c ff-z text-uppercase">Invaluable</div>
                  </div>
                  <div className="body-copy body-4 white-c ff-m-reg f-w-400">
                    Aliquam sit amet gravida lorem, sit amet egestas ligula. Morbi a sapien non
                    purus euismod mollis. Sed non leo finibus, sodales augue id, dignissim est.
                  </div>
                  <div className="black-box">
                    <div className="content-block">
                      <div className="sub-heading white-c ff-m-bd f-w-700">
                        INVALUABLE SIGNATURE DROPPING NOW
                      </div>
                      <div className="heading gradient-pink-c ff-z">GENESIS OF THE I</div>
                      <div className="body-4 white-c ff-m-reg">LIVE ON OCT 1st, 08:00PM EST.</div>
                    </div>
                    <div className="btn-wrapper">
                      <button
                        className="cta gradientBtn m-0"
                        type="button"
                        onClick={navigateToMintDrop}
                      >
                        JOIN THE DROP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 right">
                <div className="video-block box-shadow-blue-1">
                  <div className="top-block">
                    <img className="diamond-img w-100" src={iBigImg} alt="Diamond" />
                  </div>
                  <div className="bottom-block gradient-blue-bg">
                    <div className="icon-block">
                      <div className="round p-r">
                        <img
                          className="diamond-icon-small w-100"
                          src={diamondIcon}
                          alt="Diamond Icon"
                        />
                        <img className="tick-icon w-100" src={tickIcon} alt="Tick Icon" />
                      </div>
                    </div>
                    <div className="content-block">
                      <div className="sub-heading ff-m-bd f-w-700 white-c">
                        Genesis Signature Drop
                      </div>
                      <div className="body-4 white-c">@InvaluableStudios</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tall-block gradient-blue-bg b-r-20">
            <div className="row wrapper">
              <div className="col-lg-5 img-block">
                <img className="player1-img w-100" src={player1Icon} alt="Tick Icon" />
                <img className="player-full-img w-100" src={playerFullImg} alt="Tick Icon" />
              </div>
              <div className="col-lg-6 content-block">
                <div className="small-heading gradient-pink-c-1 ff-m-bold">
                  INVALUABLE SIGNATURE DROP
                </div>
                <div className="big-heading white-c ff-m-bold">“TOO TALL”</div>
                <div className="body-4 white-c">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ornare
                  mauris. Donec nec sem enim. Integer laoreet nibh sit amet varius ultrices. Nullam
                  tempor magna ligula, sit amet vulputate ligula cursus vel.
                </div>
                <div className="btn-wrapper">
                  <button className="cta blackBtn m-0" type="button" onClick={navigateToMintDrop}>
                    DROPPING <span className="gradient-pink-c">OCT 15</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="floating-lines">
              <img src={strokes} alt="Stroke lines" />
            </div>
          </div>
          <div className="collection-block">
            {/* <Link */}
            {/*  to={{ */}
            {/*    pathname: 'collection/rob-gronkowski-1', */}
            {/*    state: '/collection/rob-gronkowski-1?embed=true' */}
            {/*  }} */}
            {/* > */}
            <div className="collections_card">
              <img className="thumbnail-images" alt="1" src={globalImg} />
            </div>
            {/* </Link> */}
            {/* <Link */}
            {/*  to={{ */}
            {/*    pathname: 'collection/rob-gronkowski-1', */}
            {/*    state: '/collection/rob-gronkowski-1?embed=true' */}
            {/*  }} */}
            {/* > */}
            <div className="collections_card">
              <img className="thumbnail-images" alt="1" src={johnImg} />
            </div>
            {/* </Link> */}
            {/* <Link */}
            {/*  to={{ */}
            {/*    pathname: 'collection/rob-gronkowski-1', */}
            {/*    state: '/collection/rob-gronkowski-1?embed=true' */}
            {/*  }} */}
            {/* > */}
            <div className="collections_card">
              <img className="thumbnail-images" alt="1" src={milkImg} />
            </div>
            {/* </Link> */}
            {/* <Link */}
            {/*  to={{ */}
            {/*    pathname: 'collection/rob-gronkowski-1', */}
            {/*    state: '/collection/rob-gronkowski-1?embed=true' */}
            {/*  }} */}
            {/* > */}
            <div className="collections_card">
              <img className="thumbnail-images" alt="1" src={shooterImg} />
            </div>
            {/* </Link> */}
          </div>

          <div className="vr-block b-r-20 gradient-border p-r">
            <img className="vr-banner vr-banner-desktop w-100" src={vrBanner} alt="VR Banner" />
            <img
              className="vr-banner vr-banner-mobile w-100"
              src={vrBannerMobile}
              alt="VR Banner"
            />
            <div className="row">
              <div className="col-md-12 vr-wrapper">
                <img className="join-text-img w-100" src={joinTextImg} alt="Join the club" />
                <div className="content-block white-c">
                  <div className="small-heading ff-m-bold">INVALUABLE LIMITED ACCESS METAVERSE</div>
                  <div className="body-4">
                    We are giving away 5,000 access to the first 5,000 purchases of our
                    <b> @InvaluableStudios</b> signature assets for our INVALUABLE CLUB Metaverse
                  </div>
                  <div className="btn-wrapper">
                    <button className="cta gradientBtn not-clickable m-0" type="button">
                      LEARN MORE SOON!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

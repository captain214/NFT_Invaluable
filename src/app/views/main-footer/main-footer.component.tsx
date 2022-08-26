import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import logo1 from './assets/images/streakin-logo.svg';
import logo2 from './assets/images/polygon-logo.svg';
import twitterLogo from './assets/images/twitter.png';
import instagramLogo from './assets/images/instagram.png';
import discordLogo from './assets/images/discord.png';
import twitchLogo from './assets/images/twitch.png';
import { Routes } from '../../constants';
import { NewsletterSubscriptionForm } from '../../components/newsletter-subscription-form/newsletter-subscription-form.component';

import './assets/styles/main-footer.styles.scss';

export const MainFooter: FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = (
  props
) => {
  return (
    <footer {...props} className={classnames('main-footer', props.className)}>
      <div className="main-footer__spacing">
        <h4 className="main-footer__heading">Don’t miss any signature drop</h4>
        <p className="main-footer__description">
          Be updated on the coming drops, so you don’t miss any, keep up to date for future
          features.
        </p>

        <div className="main-footer__subscription-form">
          <NewsletterSubscriptionForm />
        </div>

        <div className="main-footer__links">
          <div className="main-footer__image">
            <img alt="logo1" src={logo1} />
          </div>
          <div className="main-footer__image">
            <img alt="logo2" src={logo2} />
          </div>

          <div className="main-footer__social-networks">
            <div className="main-footer__image">
              <img alt="twitter_logo" src={twitterLogo} />
            </div>
            <div className="main-footer__image">
              <img alt="instagram_logo" src={instagramLogo} />
            </div>
            <div className="main-footer__image">
              <img alt="discord_logo" src={discordLogo} />
            </div>
            <div className="main-footer__image">
              <img alt="twitch_logo" src={twitchLogo} />
            </div>
          </div>
        </div>

        <div className="main-footer__commercial-info">
          <div className="main-footer__info">
            Invaluable studios, inc. All rights reserved {new Date().getFullYear()}
          </div>
          <div>
            <Link to={Routes.PRIVACY_POLICY} className="links-block-link">
              privacy policy
            </Link>
          </div>
          <div>
            <Link to={Routes.TERMS_OF_SERVICE} className="links-block-link">
              terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

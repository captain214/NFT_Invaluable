import { FC, DetailedHTMLProps, FormHTMLAttributes } from 'react';

import './newsletter-subscription-form.styles.scss';

export const NewsletterSubscriptionForm: FC<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
> = () => {
  return (
    <form className="newsletter-subscription-form">
      <input
        className="newsletter-subscription-form__input"
        type="email"
        autoComplete="on"
        placeholder="Enter your email address."
        required
      />
      <button className="newsletter-subscription-form__button" type="button">
        Join now!
      </button>
    </form>
  );
};

import React from 'react';

import './art-card.styles.css';

interface Props {
  id?: string | number;
  title: string;
  url?: string;
}

export const ArtCard: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <section className="art-card">
      <picture>
        <source type="image/jpeg" />
        <img className="art-card__image" src={props.url} alt={props.title} />
      </picture>
      <h3 className="art-card__title">{props.title}</h3>
    </section>
  );
};

ArtCard.defaultProps = {
  id: '',
  url: ''
};

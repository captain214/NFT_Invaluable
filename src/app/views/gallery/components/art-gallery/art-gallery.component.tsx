import React, { useEffect, useState } from 'react';

import './art-gallery.styles.css';
import './art-gallery.styles.layout.css';

import { fetchPhotosFromAlbum, Photo } from './local-store/fetch-photos';

import { ArtCard } from './components/art-card';
import { LoadingBackground } from '../../../../components/loading-background/loading-background.component';

export const ArtGallery: React.FunctionComponent = () => {
  const [photoList, setPhotoList] = useState([]);
  const [isPhotoListLoading, setLoadingPhotoList] = useState(true);

  useEffect(() => {
    const fetchedPhotos: Promise<Photo[] | []> = fetchPhotosFromAlbum(1);
    fetchedPhotos.then((photos: any) => {
      setPhotoList(photos);
      setLoadingPhotoList(false);
    });
  }, []);

  const ArtGalleryCardContainer = (): JSX.Element => {
    const ArtGalleryNoCardContainer = (): JSX.Element => {
      return (
        <section className="art-gallery__no-card-container">
          <h1>No cards for now :(</h1>
        </section>
      );
    };

    if (isPhotoListLoading === true) {
      return <LoadingBackground />;
    }

    if (isPhotoListLoading === false && photoList.length === 0) {
      return <ArtGalleryNoCardContainer />;
    }

    return (
      // <div className="container">
      <div className="art-gallery__card-container">
        {photoList.map((photo: Photo) => {
          return <ArtCard key={photo.id} title={photo.title} url={photo.urlToBig} />;
        })}
      </div>
      // </div>
    );
  };

  return (
    <div className="art-gallery__container">
      <ArtGalleryCardContainer />
    </div>
  );
};

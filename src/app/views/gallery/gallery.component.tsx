import React, { useRef, useState } from 'react';

import './gallery.styles.css';
import './gallery.styles.layout.css';
import './gallery.styles.mobile.css';
import './gallery.styles.desktop.css';

import { useLocation } from 'react-router-dom';
import { LoadingBackground } from '../../components/loading-background/loading-background.component';

const OPENSEA_PATH = 'https://testnets.opensea.io';
const DEFAULT_PATH =
  '/assets?search[collections][0]=rob-gronkowski-1&search[collections][1]=mr-potato-head&embed=true';

export const Gallery: React.FunctionComponent = () => {
  const openseaIframe = useRef<HTMLIFrameElement>(null);
  const [isOpenseaIframeLoading, setOpenseaIframeLoading] = useState(true);

  const location = useLocation();

  const path = location.state || DEFAULT_PATH;

  return (
    <>
      <div className="gallery__footer" />
      <main className="gallery__main">
        {isOpenseaIframeLoading ? <LoadingBackground /> : null}
        <iframe
          onLoad={() => setOpenseaIframeLoading(false)}
          ref={openseaIframe}
          style={isOpenseaIframeLoading ? { display: 'none' } : { display: 'block' }}
          title="thisIsTitle"
          src={OPENSEA_PATH + path}
          frameBorder="0"
          allowFullScreen
        />
      </main>
    </>
  );
};

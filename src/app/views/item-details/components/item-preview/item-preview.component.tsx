import React, { FC } from 'react';
import cx from 'classnames';
import './item-preview.style.scss';

import { WithClassname } from '../../../../types/common/WithClassname';
import { AssetType } from '../../../../../constants/asset-type.enum';

interface IProps {
  type: AssetType;
  imageUrl: string;
  mediaUrl?: string;
}

export const ItemPreview: FC<IProps & WithClassname> = (props) => {
  // TODO: add link for browsers without HTML5 video
  return props.type === AssetType.IMAGE ? (
    <div
      className={cx(props.className, 'item-preview')}
      style={{ backgroundImage: `url(${props.imageUrl})` }}
    />
  ) : (
    <video
      autoPlay
      loop
      playsInline
      className="item-preview-video"
      poster={props.imageUrl}
    >
      <track kind="captions" />
      <source src={props.mediaUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/')} type="video/mp4" />
    </video>
  );
};

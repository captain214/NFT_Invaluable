import { DetailedHTMLProps, FC, ImgHTMLAttributes, useState } from 'react';
import classnames from 'classnames';
import verificationStampIconPath from './assets/images/verification-stamp.icon.svg';

import './assets/styles/avatar.styles.scss';

interface AvatarProps {
  hasGlow?: boolean;
  hasBorder?: boolean;
  hasVerificationStamp?: boolean;
  onImageBroken?: (isImageBroken: boolean) => void;
}

export const Avatar: FC<
  AvatarProps & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const {
    hasGlow,
    hasBorder,
    hasVerificationStamp,
    onImageBroken,
    alt,
    crossOrigin,
    decoding,
    height,
    loading,
    referrerPolicy,
    sizes,
    src,
    srcSet,
    useMap,
    width,
    ...htmlAttributesProps
  } = props;

  const [isImageBroken, setImageBrokenState] = useState(false);

  if (onImageBroken !== undefined) {
    onImageBroken(isImageBroken);
  }

  return (
    <figure
      className={classnames(htmlAttributesProps.className, 'avatar', {
        avatar__border: hasBorder,
        avatar__glow: hasGlow
      })}
    >
      <div className="avatar__backtop">
        {(isImageBroken === true || !src) && (
          <div
            {...htmlAttributesProps}
            className="avatar__default-image"
            role="img"
            aria-label={alt}
          />
        )}

        {isImageBroken === false && src && (
          <img
            {...htmlAttributesProps}
            alt={alt}
            crossOrigin={crossOrigin}
            decoding={decoding}
            height={height}
            loading={loading}
            referrerPolicy={referrerPolicy}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
            useMap={useMap}
            width={width}
            className="avatar__image"
            onError={(event) => {
              setImageBrokenState(true);

              if (htmlAttributesProps.onError === undefined) return;
              htmlAttributesProps.onError(event);
            }}
          />
        )}

        {hasVerificationStamp && (
          <img className="avatar__icon" src={verificationStampIconPath} alt="Verification stamp." />
        )}
      </div>
    </figure>
  );
};

Avatar.defaultProps = {
  hasGlow: false,
  hasBorder: false,
  hasVerificationStamp: false,
  alt: 'Avatar.'
};

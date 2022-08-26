/* eslint-disable react/jsx-props-no-spreading */
import { FC, ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import classnames from 'classnames';

import './copy-button.styles.scss';

interface CopyButtonProps {
  textToDisplay: string;
  clipboardText?: string;
}

const copyTextToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};

export const CopyButton: FC<
  CopyButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = (props) => {
  const { onClick, textToDisplay, clipboardText, ...buttonHTMLAttributes } = props;

  return (
    <button
      {...buttonHTMLAttributes}
      className={classnames('copy-button')}
      type="button"
      onClick={(event) => {
        const textForCopping = clipboardText || textToDisplay;
        copyTextToClipboard(textForCopping);

        if (onClick === undefined) return;
        onClick(event);
      }}
    >
      <div>{textToDisplay}</div>
    </button>
  );
};

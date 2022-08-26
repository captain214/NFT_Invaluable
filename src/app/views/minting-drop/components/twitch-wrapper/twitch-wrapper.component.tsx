import React, { FC, useCallback, useRef } from 'react';
import cn from 'classnames';
import './twitch-wrapper.style.scss';

import useScript from '../../../../../hooks/useScript';
import { WithClassname } from '../../../../types/common/WithClassname';

const TWITCH_SCRIPT_URL = 'https://player.twitch.tv/js/embed/v1.js';

export interface IProps {
  online?: boolean;
}

export const TwitchWrapper: FC<IProps & WithClassname> = (props) => {
  const { online = true } = props;
  const twitchEmbedRef = useRef();
  const handleScriptLoad = useCallback(() => {
    if (!online || twitchEmbedRef.current) return;
    twitchEmbedRef.current = new window.Twitch.Embed('twitch-embed', {
      width: '100%',
      height: '100%',
      channel: 'monstercat',
      parent: ['localhost'],
      theme: 'dark'
    });
  }, [online]);

  useScript(TWITCH_SCRIPT_URL, handleScriptLoad);

  return (
    <div className={cn(props.className, 'twitch-wrapper-root')}>
      <div id="twitch-embed" className="twitch-embed" />
    </div>
  );
};

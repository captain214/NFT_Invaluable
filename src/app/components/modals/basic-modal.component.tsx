import React, { FC } from 'react';
import Modal from 'react-modal';
import cn from 'classnames';
import crossSlim from '../../../assets/images/cross-icon-slim.svg';

import './basic-modal.styles.scss';
import { WithClassname } from '../../types/common/WithClassname';

interface IProps {
  isOpen: boolean;
  hideCloseBtn?: boolean;
  onRequestClose?: () => unknown;
  onAfterOpen?: () => unknown;
}

export const BasicModal: FC<IProps & WithClassname> = (props) => {
  const { children, isOpen, onRequestClose, onAfterOpen, hideCloseBtn = false } = props;

  const handleRequestClose = () => {
    onRequestClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      overlayClassName="streak-modal-overlay"
      className={cn('streak-modal-content', props.className)}
      onRequestClose={handleRequestClose}
      shouldCloseOnOverlayClick={false}
      onAfterOpen={onAfterOpen}
    >
      {!hideCloseBtn && (
        <button
          className="modal-basic-close-btn"
          aria-label="Close modal"
          style={{ backgroundImage: `url(${crossSlim})` }}
          onClick={handleRequestClose}
          type="button"
        />
      )}
      {children}
    </Modal>
  );
};

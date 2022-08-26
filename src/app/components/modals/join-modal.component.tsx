import React, { PropsWithChildren } from 'react';
import Modal from 'react-modal';
import crossSlim from '../../../assets/images/cross-icon-slim.svg';

import './join-modal.styles.scss';

interface IProps<T = any> {
  isOpen: boolean;
  hideCloseBtn?: boolean;
  onRequestClose?: () => unknown;
  onAfterOpen?: () => unknown;
}

export const JoinModal = <T,>(props: PropsWithChildren<IProps<T>>) => {
  const { children, isOpen, onRequestClose, onAfterOpen, hideCloseBtn = false } = props;

  const handleRequestClose = () => {
    onRequestClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      overlayClassName="join-modal-overlay"
      className="join-modal-content"
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

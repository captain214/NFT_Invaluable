import { FC } from 'react';
import Modal from 'react-modal';
import img_loading from '../../images/img-loading.png';
import img_close from '../../images/img-close.png';

const LoadingModal = (props: any) => {
  return (
    <Modal
      isOpen={props.isLoading}
      onRequestClose={props.toggleLoadingModal}
      contentLabel="Loading dialog"
      className="nftmodal"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <img className="img-loading" src={img_loading} alt="loading icon" />
      <p className="title__loading">Loading...</p>

      <button type="button" className="btn-cancel" onClick={props.toggleLoadingModal}>
        CANCEL
      </button>

      <div className="div-close" onClick={() => props.toggleLoadingModal()} aria-hidden="true">
        <img className="img-close" src={img_close} alt="close icon" />
      </div>
    </Modal>
  );
};

export default LoadingModal;

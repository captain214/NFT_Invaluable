import { FC } from 'react';
import Modal from 'react-modal';
import img_loading from '../../images/img-loading.png';
import img_close from '../../images/img-close.png';

const PurchasingModal = (props: any) => {
  return (
    <Modal
      isOpen={props.isProgress}
      onRequestClose={props.toggleProgressModal}
      contentLabel="Purchasing dialog"
      className="nftmodal"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <img className="img-loading" src={img_loading} alt="loading icon" />
      <p className="title">Purchase</p>
      <p className="content content--purchase">Setting up your transaction</p>

      <button type="button" className="btn-cancel" onClick={props.toggleProgressModal}>
        CANCEL
      </button>

      <div className="div-close" onClick={() => props.toggleProgressModal()} aria-hidden="true">
        <img className="img-close" src={img_close} alt="close icon" />
      </div>
    </Modal>
  );
};

export default PurchasingModal;

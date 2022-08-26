import { FC } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import img_diamond from '../../images/img-diamond.png';
import img_close from '../../images/img-close.png';
import img_ether from '../../images/img-ether.png';

const WarnningModal = (props: any) => {
  return (
    <Modal
      isOpen={props.isWarnning}
      onRequestClose={props.toggleWarnningModal}
      contentLabel="Warnning dialog"
      className="nftmodal"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <img className="img-diamond" src={img_diamond} alt="diamond icon" />
      <p className="title">You have not enough balance.</p>
      <div className="balance-div">
        <p className="total-balance">
          <span className="subscription">Total Balance : </span>
          {props.totalBalance} ETH
        </p>
      </div>

      <a href="https://wallet.polygon.technology/login/">
        <button type="button" className="btn-bridge" onClick={props.toggleWarnningModal}>
          Bridge
        </button>
      </a>

      <div className="div-close" onClick={props.toggleWarnningModal} aria-hidden="true">
        <img className="img-close" src={img_close} alt="close icon" />
      </div>
    </Modal>
  );
};

export default WarnningModal;

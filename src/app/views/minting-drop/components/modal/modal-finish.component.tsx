import { FC } from 'react';
import Modal from 'react-modal';
import img_diamond from '../../images/img-diamond.png';
import img_close from '../../images/img-close.png';
import { Routes } from '../../../../constants';

const FinishModal = (props: any) => {
  const transactionHistory = `https://mumbai.polygonscan.com/address/${process.env.REACT_APP_DROPMINTING_TOKEN}`;
  return (
    <Modal
      isOpen={props.isFinish}
      onRequestClose={props.toggleFinishModal}
      contentLabel="Finish dialog"
      className="nftmodal nftmodal--finish"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <img className="img-diamond" src={img_diamond} alt="loading icon" />
      <p className="title">
        {props.isFailed === true ? 'Your transaction has been failed.' : 'Ready.Set.Collect'}
      </p>
      <p className="content content--finish">
        {props.isFailed === true ? '' : 'Your transaction has completed'}
      </p>

      <div className="manage-result">
        <a href={Routes.PROFILE}>
          <button
            type="button"
            className="btn-viewnft"
            onClick={props.toggleFinishModal}
            hidden={props.isFailed}
          >
            VIEW YOUR NFT’S
          </button>
        </a>
        <a href={transactionHistory}>
          <button
            type="button"
            className="btn-viewtrans"
            onClick={props.toggleFinishModal}
            hidden={props.isFailed}
          >
            VIEW TRANSACTION
          </button>
        </a>
      </div>

      <div className="div-close" onClick={props.toggleFinishModal} aria-hidden="true">
        <img className="img-close" src={img_close} alt="close icon" />
      </div>
    </Modal>
  );
};

export default FinishModal;

import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import img_minus from '../../images/img-minus.png';
import img_plus from '../../images/img-plus.png';
import img_ether from '../../images/img-ether.png';
import img_close from '../../images/img-close.png';

const CheckoutModal = (props: any) => {
  return (
    <Modal
      isOpen={props.isCheckOut}
      onRequestClose={props.toggleCheckOutModal}
      contentLabel="Checkout dialog"
      className="nftmodal nftmodal--checkout"
      overlayClassName="modaloverlay"
      closeTimeoutMS={500}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      <p className="title title--checkout">Checkout</p>
      <p className="content">
        You are about to purchase the <span className="strong-title">GLOBE SERIES</span> <br />
        from <span className="strong-title">INVALUABLE</span>
      </p>
      <div className="ether-count">
        <div className="div-manage" onClick={() => props.minusEther()} aria-hidden="true">
          <img
            className="manage-ether minus"
            src={img_minus}
            alt="minus ether"
            hidden={props.isMin}
          />
        </div>
        <p id="count-ether" className="count-ether">
          {props.countEth}
        </p>
        <div className="div-manage" onClick={() => props.plusEther()} aria-hidden="true">
          <img className="manage-ether" src={img_plus} alt="plus ether" hidden={props.isMax} />
        </div>
        <div className="split" />
        <img className="ether-icon" src={img_ether} alt="ether icon" />
        <p id="value-ether" className="count-ether">
          {props.countEth / 10}
        </p>
      </div>
      <button
        className="purchase"
        type="button"
        onClick={props.maximumPurchase}
        disabled={props.isMax}
      >
        MAXIMUM PURCHASE
      </button>
      <p className="checkout-info">
        <span className="value-info">Service Fee</span>
        {props.serviceFee} ETH
      </p>
      <p className="checkout-info">
        <span className="value-info">Total</span>
        {props.countEth / 10 - props.serviceFee} ETH
      </p>
      <button
        type="button"
        className="btn-process"
        onClick={props.purchasePayment}
        disabled={props.purchaseStatus}
      >
        PROCESS TO PAYMENT
      </button>
      <div className="div-close" onClick={props.closeCheckOutModal} aria-hidden="true">
        <img className="img-close" src={img_close} alt="close icon" />
      </div>
    </Modal>
  );
};

export default CheckoutModal;
